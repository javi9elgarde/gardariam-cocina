/**
 * DATOS de las recetas — separados de la presentación.
 * Para añadir una receta nueva basta con añadir una entrada aquí.
 * Si una receta aún no tiene `ingredients`/`steps`, el libro mostrará
 * directamente sus páginas escaneadas (no se rompe nada).
 */

export interface Ingredient {
  qty?: string; // "350 g", "1 lata", "2"
  name: string; // "Carne picada"
  note?: string; // "(opcional)"
  icon?: string; // futuro: /cocina/ing/carne.png
}

export interface Step {
  title: string;
  text: string;
}

export interface RecipeData {
  story?: string; // pequeña historia / intro
  note?: string; // nota manuscrita del margen
  difficulty?: "Fácil" | "Media" | "Alta";
  ingredients?: Ingredient[];
  steps?: Step[];
  tip?: string; // Consejo del granjero
}

export const RECIPE_DATA: Record<string, RecipeData> = {
  "panceta-puerros": {
    story:
      "Este pan casero es tan fácil de hacer que cualquier ceporro puede conseguir hacerlo. Es un tipo de pan de cristal pero a lo grande. Con él hicimos un bocata de ternera con queso de cabra y cebolla caramelizada brutal.",
    difficulty: "Fácil",
    ingredients: [
      { qty: "500 g", name: "Harina de fuerza" },
      { qty: "500 g", name: "Agua tibia" },
      { qty: "5 g", name: "Levadura seca", note: "o 15 g fresca" },
      { qty: "15 g", name: "Sal" },
      { qty: "10 g", name: "Aceite de oliva" },
    ],
    steps: [
      {
        title: "Mezclar la masa",
        text: "En un bol grande echamos la harina y la levadura. Removemos con una cuchara de madera y vamos añadiendo el agua poco a poco mientras seguimos removiendo. Cuando hayamos incorporado toda el agua y la masa esté bien mezclada, humedecemos un paño, tapamos el bol y dejamos reposar durante 10 minutos.",
      },
      {
        title: "Pliegues",
        text: "Añadimos la sal y el aceite. Con las manos mojadas, hacemos varios pliegues llevando la masa desde un extremo al otro desde varios puntos de la masa. Volvemos a tapar con el paño y dejamos reposar otros 10 minutos. Repetimos el proceso dos veces más.",
      },
      {
        title: "Levado",
        text: "Dejamos reposar la masa en un lugar templado, tapada con el paño, durante 45 minutos.",
      },
      {
        title: "Formar y al horno",
        text: "Precalentamos el horno a 250 °C con una bandeja de horno vacía en la parte inferior. Echamos un poco de harina sobre la mesa y volcamos la masa. Cortamos en varios rectángulos y, con cuidado, los pasamos ligeramente por harina. Colocamos los rectángulos sobre otra bandeja con papel de horno y la ponemos en la mitad del horno.",
      },
      {
        title: "Vapor y horneado",
        text: "Vertemos rápidamente agua muy fría con unos cubitos de hielo en la bandeja inferior para generar vapor. Cerramos el horno rápido y horneamos durante 10 minutos.",
      },
      {
        title: "Enfriar",
        text: "Retiramos los panecillos del horno y los dejamos enfriar sobre una rejilla para que el aire circule también por la parte inferior. Una vez frío, se puede comer o congelar para otro día.",
      },
    ],
    tip: "El truco está en el vapor: el hielo en la bandeja de abajo le da esa corteza crujiente.",
  },

  "lasana": {
    story:
      "Esta receta tiene el punto de que no necesitamos horno para hacerla. Nuestra boloñesa es la unión de la receta tradicional italiana con cositas nuestras. El truco al final es dejar la boloñesa cuanto más tiempo mejor para conseguir un increíble sabor.",
    difficulty: "Media",
    ingredients: [
      { qty: "350 g", name: "Carne picada" },
      { qty: "150 g", name: "Longaniza" },
      { qty: "1", name: "Cebolla mediana" },
      { qty: "2", name: "Zanahorias" },
      { qty: "1", name: "Apio", note: "opcional" },
      { qty: "400 g", name: "Tomate triturado" },
      { qty: "1 hoja", name: "Laurel" },
      { qty: "150 ml", name: "Vino tinto" },
      { name: "Aceite de oliva" },
      { qty: "400 ml", name: "Caldo de carne" },
      { qty: "14 placas", name: "Lasaña seca" },
      { name: "Pimienta", note: "al gusto" },
      { qty: "550 ml", name: "Leche" },
      { qty: "40 g", name: "Mantequilla" },
      { qty: "40 g", name: "Harina" },
      { qty: "40 g", name: "Parmesano" },
      { name: "Sal", note: "al gusto" },
    ],
    steps: [
      {
        title: "Boloñesa a fuego lento",
        text: "Troceamos la cebolla, la zanahoria y el apio (si lo ponemos) en cachos pequeños. Cogemos las longanizas y con un cuchillo hacemos un corte poco profundo para quitarles la tripa y poder desmenuzarlas como si fuesen carne picada. Ponemos aceite en una sartén y vamos a freírla muy bien para dejarla dorada, reservamos y vamos a echar la verdura, salpimentamos y dejamos pochando. Cuando esté más o menos blandita echamos la carne picada (nosotros usamos de ternera) e igual a fuego fuerte la doramos muy bien mientras la machacamos. A los 4 minutos echamos la longaniza y un chorrito grande de vino tinto y dejamos evaporar. Cuando haya evaporado toca poner el tomate triturado.",
      },
      {
        title: "Cocer la boloñesa",
        text: "Ponemos una hoja de laurel y tapamos, dejamos cocinar a fuego lento (mínimo 1h aunque es mejor dejarlo 2-3 horas). Id revisando, cuando ya se haya evaporado la parte del agua del tomate vamos echando cacitos de caldo. Cuando haya pasado su tiempo lo probamos de sal y acidez. Un truco es echar un vasito de leche para aligerar y suavizar la boloñesa. Si queda algo de líquido destapar y terminar la boloñesa.",
      },
      {
        title: "Bechamel",
        text: "Lo siguiente es dejar hecha la bechamel que será con misma cantidad siempre de mantequilla y harina, en nuestro caso 40 y 40 gramos. Echamos primero la mantequilla, cuando se funda echamos la harina y con una varilla lo vamos removiendo hasta tostar un poco la mezcla. Calentamos la leche y la echamos casi toda y removemos bien todo, si está muy espesa, más leche hasta conseguir un equilibrio, probamos de sal y echamos pimienta. Si se queda algún grumo podemos pasarla por la batidora y colarlo para dejarlo mejor.",
      },
      {
        title: "Cocemos y servimos",
        text: "Por último, ponemos un poco más de caldo en la boloñesa y ponemos las placas de horno a la mitad y tapamos, vamos vigilando y removiendo hasta que la pasta esté en su punto, echamos el queso rallado y servimos en el plato. Le echamos la bechamel por encima.",
      },
    ],
    tip: "La paciencia hace que esta lasaña quede espectacular. ¡Vale la pena!",
  },

  "pollo-ajillo": {
    story:
      "Una de las recetas más ricas que se pueden hacer con pocos ingredientes. Esta es de las recetas de tener una barra de pan al lado para mojar una y otra vez. Era difícil elegir una sola receta de la gran chef Chelo, pero esta es una de las que más hacemos en casa y que más nos gusta.",
    note: "Se puede usar conejo también junto con el pollo.",
    difficulty: "Fácil",
    ingredients: [
      { qty: "2 kg", name: "Pollo troceado" },
      { qty: "1 lata", name: "Cerveza suave" },
      { qty: "6-7 dientes", name: "Ajo" },
      { name: "Caldo de pollo o agua" },
      { name: "Aceite de oliva" },
      { name: "Perejil", note: "seco o fresco" },
      { qty: "1 hoja", name: "Laurel" },
      { qty: "2", name: "Patatas", note: "opcional" },
      { qty: "1 chorrito", name: "Vino blanco" },
    ],
    steps: [
      {
        title: "Freír la carne",
        text: "Lo primero será separar todos los dientes de ajo sin pelar y con el mango del cuchillo apoyado en el ajo les damos un golpe. A continuación los echamos en una cazuela con aceite cubriendo la superficie y a fuego lento vamos a ir friéndolos. En paralelo, cogemos el pollo y lo salpimentamos. Cuando los ajos lleven un rato, los reservamos y subimos el fuego fuerte para dorar bien todo el pollo, hay que caramelizar y dorar bien la superficie del pollo (hacerlo por tandas para que se frían bien).",
      },
      {
        title: "La magia del chup chup",
        text: "Una vez dorado todo vamos a echarlo de vuelta a la cazuela junto con los ajos, una hoja de laurel y echamos la cerveza suave. Dejamos que se evapore un poco hasta que deje de oler a alcohol y echamos el caldo de pollo o agua hasta casi cubrir y lo dejamos medio tapado 40 minutos a fuego medio.",
      },
      {
        title: "Patatas fritas",
        text: "Mientras se va cocinando vamos a ir pelando las patatas y las cortamos en bastoncitos o cuadraditos. Las freímos en abundante aceite y reservamos para que coincida a tiempo con el siguiente paso y así comernos todo caliente.",
      },
      {
        title: "Último toque y a comer",
        text: "Cuando hayan pasado 35 minutos en un mortero vamos a sacar los ajos que ya estarán muy blanditos (tiramos la piel) y vamos a machacarlos en el mortero, al que le echaremos un chorro de vino blanco y perejil fresco o seco (opcional: frutos secos o hierbas provenzales o tomillo). Lo mezclamos todo muy bien y lo echamos en la cazuela destapada para que se evapore el alcohol del vino blanco. Probamos el caldo de sal y que el pollo esté tierno (si no lo dejamos más tiempo). Retiramos todo a una fuente y servimos junto con las patatas fritas y una buena rebanada de pan.",
      },
    ],
    tip: "Ten una barra de pan cerca: el caldito de esta receta es lo mejor.",
  },
};

export function getRecipeData(id: string): RecipeData | undefined {
  return RECIPE_DATA[id];
}
