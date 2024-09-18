import sql from 'better-sqlite3';
import slugify from "slugify";
import xss from "xss";
import fs from 'node:fs';
import { Buffer } from 'node:buffer'; // Use Node's native Buffer

const db = sql('meals.db');

export async function getMeals() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
    meal.slug = slugify(meal.title, {lower: true});
    meal.instructions = xss(meal.instructions);

    const extension = meal.image.name.split('.').pop();
    const fileName = `${meal.slug}.${extension}`;

    const bufferedImage = Buffer.from(await meal.image.arrayBuffer());

    await fs.promises.writeFile(`public/images/${fileName}`, bufferedImage);

    meal.image = `/images/${fileName}`;

    db.prepare(`
        INSERT INTO meals
        (title, summary, instructions, image, creator, creator_email, slug)
        VALUES (
            @title,
            @summary,
            @instructions,
            @image,
            @creator,
            @creator_email,
            @slug
        )
    `).run(meal);
}
