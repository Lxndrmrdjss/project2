import {db} from '$lib/server/db';
import {user} from '$lib/server/db/schema';
import {json} from '@sveltejs/kit';


import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const data = await db.select().from(user);
    return json({ data: data});
};

export const POST: RequestHandler = async (request) => {
    const{name, age} = await request.request.json();
    const query = await db.insert(user).values({name: name, age: age})

    return json({query});
};