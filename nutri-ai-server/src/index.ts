import { Hono } from "hono";
import axios from "axios";
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    API_URL: string;
    APP_ID: string;
    API_KEY: string;
  };
}>();


app.use(cors({
  origin: "*",
}))

interface RecipeHit {
  recipe: {
    label: string;
    ingredientLines: string[];
    image: string;
  };
}

interface RequestBody {
  allergies: string | string[];
  preferredIngredients: string | string[];
}

function ensureArray(value: string | string[]): string[] {
  if (typeof value === 'string') {
    return value.split(',').map(item => item.trim());
  }
  return Array.isArray(value) ? value : [];
}

app.post("/", async (c) => {
  try {
    const body: RequestBody = await c.req.json();
    const excludedIngredients = ensureArray(body.allergies).join(',');
    const ingredients = ensureArray(body.preferredIngredients).join(',');

    const response = await axios.get(c.env.API_URL, {
      params: {
        app_id: c.env.APP_ID,
        app_key: c.env.API_KEY,
        q: ingredients,
        exclude: excludedIngredients,
        random: true,
        from: 0,
        to: 10,
      },
    });

    const recipes = await Promise.all(
      response.data.hits.map(async (hit: RecipeHit) => {
        return {
          title: hit.recipe.label,
          ingredients: hit.recipe.ingredientLines,
          image: hit.recipe.image,
        };
      }),
    );

    return c.json({ recipes });
  } catch (error) {
    console.error("API error:", error);
    return c.json({ error: "Server error, please try again later." }, 500);
  }
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;