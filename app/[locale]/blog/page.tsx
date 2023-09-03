'use client'
import { title } from "@/components/primitives";

import { useSelector } from 'react-redux';

export const runtime = 'edge';

function BlogPage() {
	const user = useSelector((state: any) => state.user);
	return (
		<div>
			<h1 className={title()}>Blog</h1><br />
			<h2 className={title()}>{user.name}</h2><br />
			<h3 className={title()}>{user.email}</h3>
		</div>
	);
}

export default BlogPage