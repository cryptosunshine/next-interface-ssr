import { IncomingHttpHeaders } from 'http';
import Storage, { KEY_USER_TOKEN, userLoginOut, Context } from './storage';


type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'del';

interface Response<T> {
    code: number
    msg: string
    data?: T | any
}

interface CustomHeaderValues extends IncomingHttpHeaders {
    redirectUrl?: string;
    Authorization?: string;
}

type CustomHeader = CustomHeaderValues | HeadersInit | undefined;


const CODE_SUCCESS = 200; // 成功
const CODE_INVALID_PARAM = 500; // 参数错误
const CODE_NEED_LOGIN = 405; // 未登录
const CODE_INVALID_ERROR = 400; // 内部错误
const methods: Array<HttpMethod> = ['get', 'post', 'put', 'patch', 'del'];

interface RequestData {
    header?: any;
    params?: any;
    data?: any;
    attach?: any;
    field?: any;
}

type Request<T> = (path: string, data?: RequestData) => Promise<T>;

export class BaseApiClient<T> {

    context: Context | undefined;

    get!: Request<Response<T>>;

    post!: Request<Response<T>>;

    put!: Request<Response<T>>;

    patch!: Request<Response<T>>;

    del!: Request<Response<T>>;

    constructor(context?: Context) {
        this.context = context;
        this.customResultHandler = this.customResultHandler.bind(this);
        methods.forEach((method: HttpMethod) =>

            this[method] = (url: string, { header, params, data, attach, field }: RequestData = {}) => new Promise((resolve, reject) => {
                const redirectUrl = `${window.location.pathname}${window.location.search}`;
                const storage = new Storage(context);
                const headers: CustomHeader = { Authorization: storage.get(KEY_USER_TOKEN) };
                if (redirectUrl && redirectUrl !== '/') {
                    headers.redirectUrl = redirectUrl;
                }
                const metaData: RequestInit = {
                    method: method.toUpperCase(),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: storage.get(KEY_USER_TOKEN),
                        ...header
                    }
                };

                //get请求，拼接query
                if (params) {
                    let paramsArray: string[] = [];
                    Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
                    if (url.search(/\?/) === -1) {
                        url += '?' + paramsArray.join('&')
                    } else {
                        url += '&' + paramsArray.join('&')
                    }
                }

                //post请求
                if (data) {
                    metaData["body"] = JSON.stringify(data);
                }

                //文件上传
                if (attach) {
                    const formData = new FormData();
                    
                    Object.keys(attach).forEach(key => {
                        const files = attach[key];
                        if (files instanceof Array) {
                            files.forEach(file => formData.append(key, file));
                        } else {
                            formData.append(key, files);
                        }
                    })

                    if (field) {
                        Object.keys(field).forEach(key => {
                            formData.append(key, field[key]);
                        })
                    }

                    metaData["body"] = formData;
                    // 这里 go-server 文件上传 不需要自己指定 content-type 否则会报错
                    // https://blog.csdn.net/NNnora/article/details/81385257
                    console.log(storage.get(KEY_USER_TOKEN))
                    metaData.headers = {
                        Authorization: storage.get(KEY_USER_TOKEN),
                        ...header
                    }
                }
                fetch(url, metaData).then(res => {
                    if (res.status != 200) {
                        this.customResultHandler(url, { code: res.status, msg: res.statusText }, resolve, reject);
                        return;
                    }
                    res.json().then((result) => {
                        this.customResultHandler(url, result, resolve, reject);
                    })
                }).catch((e: Error) => reject(e));


            }));
    }

    public customResultHandler(url: string, result: any, resolve: (value: Response<T> | PromiseLike<Response<T>>) => void, reject: (reason?: any) => void) {
        resolve(result);
    }

    /*
     * There's a V8 bug where, when using Babel, exporting classes with only
     * constructors sometimes fails. Until it's patched, this is a solution to
     * "ApiClient is not defined" from issue #14.
     * https://github.com/erikras/react-redux-universal-hot-example/issues/14
     *
     * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
     *
     * Remove it at your own risk.
     */
    empty() {
    }
}

export default class ApiClient<T> extends BaseApiClient<T> {

    customResultHandler = (url: string, result: any, resolve: (value: Response<T> | PromiseLike<Response<T>>) => void, reject: (reason?: any) => void) => {
        if (CODE_SUCCESS === result.code) {
            resolve(result);
        } else if (CODE_NEED_LOGIN === result.code) {
            userLoginOut(this.context);
        } else {
            resolve(result);
        }
    }

}
