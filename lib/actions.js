'use server';

import {saveMeal} from "@/lib/meals";
import {redirect} from "next/navigation";

function isInvalidTet(text) {
    return !text || text.trim() === '';
}

export async function shareMeal(prevState, formData) {
    const meal = {
        title: formData.get('title'),
        summary: formData.get('summary'),
        instructions: formData.get('instructions'),
        image: formData.get('image'),
        creator: formData.get('name'),
        creator_email: formData.get('email')
    };

    if(isInvalidTet(meal.title) || isInvalidTet(meal.summary) ||
        isInvalidTet(meal.instructions) || isInvalidTet(meal.creator) ||
        isInvalidTet(meal.creator_email) ||
        meal.creator_email.includes('@') ||
        !meal.image || meal.image.size === 0) {
        return {
            message: 'Invalid input.'
        };
    }

    await saveMeal(meal);
    redirect('/meals');
}