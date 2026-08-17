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
  focaccia: {
    story:
      "Después de hacer el Pan Ceporros le cogimos el gusto y decidimos probar algo nuevo: hacer una focaccia, pero en formato bocadillo. Pensamos cómo rellenarla y en seguida nos vino a la mente una combinación italiana que nos encanta: Mortadela de Bolonia con Burrata y salsa Pesto. ¡Acertamos de pleno!",
    difficulty: "Media",
    ingredients: [
      { qty: "500 g", name: "Harina de fuerza" },
      { qty: "3 g", name: "Levadura fresca" },
      { qty: "14 g", name: "Sal" },
      { qty: "400 g", name: "Agua fría" },
      { name: "Aceite de oliva" },
      { name: "Pistacho", note: "en trocitos" },
      { name: "Salsa pesto" },
      { qty: "1", name: "Burrata entera" },
      { name: "Mortadela de Bolonia" },
    ],
    steps: [
      {
        title: "Preparamos la masa (24 h)",
        text: "En un recipiente ponemos la harina, la levadura fresca desmenuzada, la sal y toda el agua fría de golpe; removemos con una cuchara hasta integrar bien todos los ingredientes, luego echamos una cucharada de aceite de oliva y volvemos a remover muy bien. Después dejamos que repose una hora tapado con la tapa del recipiente o con un paño húmedo. Tras esto echamos un chorrito pequeño de aceite y hacemos varios pliegues doblando la masa desde los lados al centro. Una vez hecho lo dejamos en la nevera tapado durante 24 h.",
      },
      {
        title: "Amasamos y al horno",
        text: "Pasadas las 24 h estará con el doble de tamaño y si tiene burbujas mejor aún. Sacamos la masa a una bandeja de horno a la que le hayamos puesto otro chorrito de aceite y cogemos los bordes, estiramos y los llevamos al lado contrario, así con todos los lados, y terminamos dándole la vuelta a la masa. Tapamos con film y dejamos unas 2 horas a temperatura ambiente.",
      },
      {
        title: "Horneamos",
        text: "Precalentamos el horno a 220° y echamos un pelín más de aceite, extendiéndolo con los dedos para que cubra toda la bandeja. Horneamos 20-25 min (depende del horno) y dejamos enfriar en una rejilla.",
      },
      {
        title: "Montamos el bocadillo",
        text: "Ya solo queda montar el bocadillo con 3-4 lonchas de mortadela, la burrata encima (con un cuchillo la cortamos por la mitad y la extendemos), luego con una cuchara extendemos el pesto y para rematar trocitos de pistacho.",
      },
    ],
    tip: "El agua bien fría y las 24 h de nevera son el secreto de esas burbujas.",
  },

  "croquetas-cocido": {
    story:
      "Unas buenas croquetas son ese plato infalible que nunca sobra en una celebración. Especialmente las de cocido de Susi, una receta aprendida de su madre Marisol a la que supo darle su toque personal, y que están tan ricas que dan ganas de comerse la masa a cucharadas recién hecha. Nosotros hemos sido fieles a su versión original, aportando solo un empanado de panko para que queden extra crujientes.",
    note: "Hechas con amor de abuela, de madre y de nieta. Receta familiar.",
    difficulty: "Media",
    ingredients: [
      { name: "Restos de cocido" },
      { qty: "2-3", name: "Huevos grandes" },
      { qty: "2 tazas", name: "Leche" },
      { qty: "1 vaso", name: "Caldo de cocido" },
      { qty: "3 o 4 cucharadas", name: "Harina" },
      { qty: "1", name: "Cebolla pequeña" },
      { name: "Panko", note: "para empanar" },
      { qty: "1 cucharada", name: "Mantequilla" },
      { name: "Aceite de oliva" },
      { name: "Sal", note: "al gusto" },
    ],
    steps: [
      {
        title: "Prepara la masa",
        text: "Cogemos una cebolla pequeña y la cortamos en 4-5 cachos, los pochamos en la sartén con mantequilla y, cuando haya cogido sabor la mantequilla, quitamos la cebolla. Ponemos ahora la carne del cocido bien picada, que en nuestro caso usamos morcillo, pollo, un poco de chorizo, jamón y espinazo. Echamos unas 3 cucharadas de harina y sal al gusto; cuando la harina se tueste echamos el vasito de caldo de cocido. Luego echamos la taza de leche que calentamos 1 minuto en el microondas. Vamos moviendo; si queda muy espeso le podemos echar un poco más de leche según haga falta. Probamos la masa de sal y corregimos.",
      },
      {
        title: "Reposo y enfriar",
        text: "Sacamos la masa a un plato lo más grande posible y la dejamos enfriar. Una vez esté templada la vamos a tapar con papel film en contacto con la masa de la croqueta (para que no se seque). La dejamos en el frigorífico toda la noche.",
      },
      {
        title: "Empanamos y boleamos",
        text: "Cuando ya esté fría la masa, podremos empanar las croquetas. Primero con harina, después con huevo y por último una buena capa de panko. Cuando las croquetas estén montadas, lo que recomendamos es congelarlas para que no se deshagan al cocinarlas.",
      },
      {
        title: "A freír",
        text: "Cuando queramos freírlas calentamos abundante aceite y vamos echándolas a fuego medio fuerte para que se hagan bien por dentro; si el fuego está muy fuerte se quedarán frías en su interior.",
      },
    ],
    tip: "Congélalas antes de freír: así no se deshacen y quedan perfectas.",
  },

  "croquetas-rotini": {
    story:
      "Con esta receta ganamos un concurso de comida. Unas croquetas de huevos rotos con jamón no falla. Aconsejamos que el jamón que uséis para los trozos sea un jamón rico. Como consejo extra, podéis hacer una salsa de yema de huevo para echar por encima cuando vayáis a servirlas.",
    difficulty: "Media",
    ingredients: [
      { qty: "2 puntas", name: "Jamón" },
      { qty: "3", name: "Huevos grandes" },
      { qty: "2 tazas", name: "Leche" },
      { name: "Lonchas de jamón", note: "cortado en taquitos" },
      { qty: "3 o 4 cucharadas", name: "Harina" },
      { qty: "1 brick", name: "Nata líquida para cocinar" },
      { name: "Panko", note: "para empanar" },
      { name: "Aceite de oliva", note: "para freír" },
      { qty: "1 cucharada", name: "Mantequilla" },
      { name: "Sal", note: "al gusto" },
    ],
    steps: [
      {
        title: "Infusión de leche con jamón",
        text: "Ponemos en una olla los huesos de jamón con 2 tazas de leche y la nata. Llevamos casi a ebullición, apartamos del fuego y lo dejamos reposar con la tapa puesta 30 min. Retiramos la grasa de la superficie con una cuchara.",
      },
      {
        title: "Bechamel de jamón",
        text: "En una sartén grande, calentamos la mantequilla y freímos los cachitos de jamón a fuego medio hasta que suelten su grasa. Añadimos 3-4 cucharadas de harina y la cocinamos. Vertemos poco a poco la leche infusionada, removiendo, hasta que quede la textura perfecta (ajustamos con más leche si está demasiado espesa).",
      },
      {
        title: "La magia de los huevos fritos",
        text: "Freímos los dos huevos en otra sartén hasta dorar y sacar puntillita. Los cortamos en trocitos y los añadimos a la masa. Sacamos la masa a un plato/fuente de cristal, dejamos enfriar y lo tapamos con papel film. Metemos a la nevera.",
      },
      {
        title: "Empanando y cocinando",
        text: "Una vez fría la masa, empanamos las croquetas pasando primero por harina, luego por huevo y finalmente por panko. Una vez formadas, las congelamos para que no se deshagan al freír. Las freímos directamente del congelador en abundante aceite a fuego alto (sin llegar al máximo) para que se doren por fuera y queden bien hechas por dentro.",
      },
    ],
    tip: "Usa un jamón rico para los taquitos: se nota muchísimo en el resultado.",
  },

  risotto: {
    story:
      "Cuando viajamos por Italia hace unos años nos trajimos esta receta de Milán que nos encantó. Le hemos añadido alguna cosa que no está en la receta original y la verdad que es fácil de hacer y está riquísimo. Receta express.",
    difficulty: "Media",
    ingredients: [
      { qty: "170 g", name: "Arroz risotto" },
      { qty: "media", name: "Cebolla" },
      { qty: "1 diente", name: "Ajo" },
      { name: "Caldo de pollo o carne" },
      { qty: "100 g", name: "Parmesano" },
      { qty: "50 ml", name: "Vino blanco" },
      { name: "Azafrán", note: "varias hebras" },
      { qty: "1 hoja", name: "Laurel" },
      { qty: "100 g", name: "Mantequilla" },
      { qty: "1", name: "Yema de huevo" },
      { name: "Sal", note: "pizca" },
      { name: "Pimienta", note: "pizca" },
    ],
    steps: [
      {
        title: "Base y sofrito",
        text: "En una cazuela mediana echamos una nuez de mantequilla, el diente de ajo pelado y la hoja de laurel y vamos removiendo a fuego medio; a continuación echamos la cebolla bien finita y removemos. Cuando la cebolla empiece a transparentar echamos el arroz y removemos muy bien a fuego lento.",
      },
      {
        title: "Vino y azafrán",
        text: "Cuando haya pasado un par de minutos echamos otro trocito de mantequilla y, cuando el arroz se vea un poco transparente, subimos el fuego y echamos el chorrito de vino blanco, seguimos removiendo. Cuando esté a punto de evaporarse le ponemos un poco de sal y a remover hasta que el arroz haya absorbido el líquido; entonces echaremos las hebras de azafrán.",
      },
      {
        title: "Caldo poco a poco",
        text: "Echamos un cazo de caldo (templado o caliente). Ahora es ir echando caldo y removiendo a medida que te lo pida el arroz; el truco es no dejar que el arroz esté sobrado de caldo ni que haya muy poco líquido.",
      },
      {
        title: "Mantecar y servir",
        text: "Cuando el arroz esté en su punto, echamos otra nuez de mantequilla, el queso parmesano y apartamos del fuego. Echamos la yema de huevo, removemos, servimos y ponemos pimienta recién molida.",
      },
    ],
    tip: "El caldo siempre caliente: si lo echas frío, cortas la cocción del arroz.",
  },

  "pollo-curry": {
    story:
      "Desde que Sandra nos descubrió esta receta, se ha convertido en una de nuestras favoritas. La salsa de este plato es un auténtico vicio; combinado con el arroz y el pollo consiguen una mezcla de sabores perfecta. También hemos hecho alguna vez con la salsa y el pollo un relleno para empanadillas que quedan espectaculares. Os encantará.",
    note: "Para una salsa perfecta tenéis que tener una batidora de tipo Turmix.",
    difficulty: "Fácil",
    ingredients: [
      { qty: "1", name: "Cebolla mediana" },
      { qty: "2 cucharaditas", name: "Curry" },
      { qty: "400 g", name: "Contramuslos deshuesados" },
      { qty: "120 g", name: "Arroz largo" },
      { qty: "200 ml", name: "Nata líquida" },
      { name: "Aceite de oliva" },
      { name: "Sal", note: "al gusto" },
      { qty: "1", name: "Manzana golden" },
      { name: "Miel", note: "chorrito, opcional" },
    ],
    steps: [
      {
        title: "Creando la salsa y marinando el pollo",
        text: "En un bol añadimos un poco de aceite y una cucharadita de curry y mezclamos bien. Añadimos a esa mezcla los trozos de contramuslos deshuesados a los que habremos puesto sal y tapamos el bol con papel film. Lo dejaremos en la nevera mientras seguimos con los siguientes pasos. Cortamos la cebolla en juliana y la manzana en daditos. En una sartén con un poco de aceite ponemos primero la cebolla y cuando se empiece a poner blandita echamos la manzana; esperamos a que la manzana también esté blandita para echar la nata y una cucharadita de curry.",
      },
      {
        title: "Triturar la salsa",
        text: "Removemos todo, corregimos de sal y cuando veamos que la salsa coge un poco de espesor la vamos a echar a un vaso batidor y la trituramos con la batidora eléctrica de tipo Turmix para crear una salsa increíble (corregir si está muy picante con un poco de leche y si le falta dulzor le podemos poner miel).",
      },
      {
        title: "Cociendo el arroz",
        text: "Mientras vamos haciendo el paso 1 ponemos agua a cocer y cuando hierva echamos el arroz, con sal, para cocer un arroz normal. Si queremos que quede más suelto podemos remojar el arroz previamente y quitarle el almidón.",
      },
      {
        title: "Freímos el pollo y lo unimos",
        text: "Sacamos de la nevera los contramuslos y los echamos a la sartén (evitar el exceso de aceite), ya que lo que vamos a hacer es sellar todo el pollo. Una vez sellado por los dos lados, echamos la salsa y lo dejamos haciéndose poco a poco (fuego medio bajo), hasta que esté cocinado el pollo por dentro. Una vez esté hecho por dentro vamos a emplatar.",
      },
    ],
    tip: "Triturar bien la salsa es lo que la hace sedosa: no te saltes ese paso.",
  },

  "lentejas-curry": {
    story:
      "Los platos de cuchara que solemos hacer son más tradicionales pero queríamos poner alguno un poco más exótico y que estuviese riquísimo. Si queréis unas lentejas un poco diferentes y que lo tengáis hecho en 20 minutos, probad esta receta que está espectacular. Se suele acompañar de pan indio pero con el normal también vas a disfrutar.",
    difficulty: "Fácil",
    ingredients: [
      { qty: "1/4 lata", name: "Leche de coco" },
      { qty: "300 g", name: "Lenteja cocida" },
      { qty: "1", name: "Cebolla pequeña" },
      { qty: "1/2 cucharada", name: "Curry" },
      { name: "Tomate concentrado", note: "chorrito" },
      { name: "Cilantro fresco", note: "opcional" },
      { qty: "120 g", name: "Arroz largo" },
      { name: "Sal", note: "al gusto" },
      { name: "Aceite de oliva" },
    ],
    steps: [
      {
        title: "Pochando la cebolla",
        text: "Recomiendo hacer el paso 1 y 2 a la vez para coordinarlo todo. Cortaremos la cebolla en cubitos pequeños y lo ponemos en una sartén con un chorrito de aceite de oliva a fuego medio. Echamos un poco de sal y vamos cocinando despacio para que se vaya pochando. Cuando esté blandita vamos a echar la media cucharada de curry (si después vemos que falta algo más lo podemos echar más adelante). Mezclamos la cebolla con el curry y en seguida echamos un poco de tomate concentrado. Integramos todo, mientras vamos a sacar las lentejas cocidas, de tipo pardina, a un colador si las tenemos de bote para echarles un poco de agua.",
      },
      {
        title: "Cociendo el arroz",
        text: "Mientras vamos haciendo el paso 1 ponemos agua a cocer y cuando hierva echamos el arroz, con sal, para cocer un arroz normal. Si queremos que quede más suelto podemos remojar el arroz previamente y quitarle el almidón.",
      },
      {
        title: "Mezclamos todo y emplatamos",
        text: "Echamos las lentejas cocidas a la sartén y mezclamos todo; después vamos a poner un cuarto de la lata de leche de coco (se puede poner un poquito más). Vamos a mezclar todo y en este punto, mientras dejamos que haga chup chup, probaremos de sal y de curry; podemos añadir más sal y más curry si queremos un poco más. Cuando pasen unos minutos y haya cogido espesor vamos a servir en el plato: a un lado el arroz blanco que ya tendremos cocido y al otro lado las lentejas. Le podemos echar por encima un poco de cilantro si nos gusta.",
      },
    ],
    tip: "Con pan indio (naan) sube de nivel, pero con pan normal también vuela.",
  },

  "arroz-horno": {
    story:
      "El arroz al horno es una de esas comidas poco conocidas fuera de Valencia y es de nuestros platos favoritos. Siempre que hacemos cocido aprovechamos para hacer un riquísimo arroz al horno con las sobras. Desde que estamos juntos hemos ido propagando esta receta entre familiares y amigos. Con esto esperamos propagarla aún más y que podáis disfrutar como nosotros de este manjar valenciano.",
    note: "¡Gracias yaya! Recomendamos mucho hacer esta receta en una cazuela de barro.",
    difficulty: "Media",
    ingredients: [
      { qty: "1", name: "Patata mediana" },
      { qty: "1", name: "Morcilla de cebolla" },
      { qty: "3-4 dientes", name: "Ajo" },
      { name: "Sobras de cocido" },
      { name: "Aceite de oliva", note: "para freír" },
      { name: "Sal", note: "al gusto" },
      { qty: "400 g", name: "Arroz redondo" },
      { name: "Pimentón dulce" },
    ],
    steps: [
      {
        title: "Preparando todo",
        text: "Lo primero que haremos será calentar las sobras de cocido en el propio caldo. De las sobras nosotros usamos para esta receta el pollo, morcillo, chorizo, tocino y garbanzos. Ponemos el horno a 250° calor por arriba y abajo. Pelamos y cortamos en rodajas una patata mediana, pelamos 3-4 ajos y dejamos la morcilla preparada. Aparte, si tenemos tocino del cocido, lo secamos con papel de cocina.",
      },
      {
        title: "Friendo todo",
        text: "Echamos el ajo a freír a fuego medio en una sartén con aceite. Cuando empiece a dorarse, echamos las rodajas de patata y las freímos. Reservamos el ajo cuando esté dorado, metemos la morcilla. Sacamos la patata y la morcilla cuando esté frita por los lados. Reservamos.",
      },
      {
        title: "Mezclando todo",
        text: "Cogemos nuestro tocino y lo troceamos en cachitos pequeños, se fríe durante un par de minutos (cuidado si salta). Bajamos un poco el fuego, echamos una cucharada pequeña de pimentón dulce (no de la Vera), le damos una vuelta y en seguida echamos el arroz para que no se queme. Mezclamos todo muy bien para que el arroz coja todo el sabor. Después echamos el arroz en la cazuela de barro, lo extendemos para que cubra la superficie, ponemos los ajos, las patatas y la morcilla por encima, también echamos el pollo, morcillo, chorizo y garbanzos por encima.",
      },
      {
        title: "Al horno",
        text: "Para terminar echamos el doble de caldo que de arroz, por lo que echaremos en nuestro caso 8 cazos de caldo (probar de sal el caldo). Lo metemos al horno y le damos unos 20 min. Cuando veamos que el caldo se ha consumido, abrimos con cuidado, probamos y sacamos cuando el arroz esté en su punto.",
      },
    ],
    tip: "En cazuela de barro cambia por completo: aguanta el calor y el arroz queda perfecto.",
  },

  paella: {
    story:
      "Una receta que siempre es muy polémica pero realmente tiene unos ingredientes muy concretos. Es uno de nuestros platos favoritos y no podía faltar en este libro. Esta receta siempre la hemos comido en unas condiciones privilegiadas, que son: hecha en Valencia, a leña y con un maestro paellero de toda la vida. ¿Algún día llegaremos a igualarla?",
    note: "¡Gracias yayo! Se puede poner alcachofa en temporada, queda brutal.",
    difficulty: "Alta",
    ingredients: [
      { qty: "500 g", name: "Arroz redondo" },
      { qty: "750 g", name: "Pollo troceado" },
      { qty: "400 g", name: "Conejo troceado" },
      { qty: "200 g", name: "Judía verde plana" },
      { name: "Tomate triturado o rallado" },
      { qty: "100 g", name: "Garrofón" },
      { name: "Romero fresco" },
      { name: "Pimentón dulce" },
      { name: "Aceite de oliva" },
      { name: "Azafrán", note: "o colorante alimentario" },
      { name: "Sal", note: "al gusto" },
    ],
    steps: [
      {
        title: "La base de una buena paella",
        text: "Lo ideal sería hacerlo en una paellera con gas o leña; en vitro recomiendo seguir la receta pero hacer mejor un arroz caldoso o meloso. Primero será echar un buen chorro de aceite de oliva en el centro y echar sal por los bordes. Preparamos el pollo y el conejo ya sazonados; cuando esté el aceite caliente lo echamos y, sin moverlo mucho, vamos dejando que se dore muy bien para crear un fondo que será la clave en el sabor. Una vez esté bien dorada la carne la movemos a los lados y echamos las judías verdes en el centro, las freímos bien.",
      },
      {
        title: "Hacemos el sofrito",
        text: "Ahora nos toca echar el tomate rallado o triturado, mezclamos todo y dejamos que reduzca; luego echamos una cucharadita de pimentón dulce (no de la Vera) y en seguida echamos agua hasta cubrir toda la carne. En este punto echamos la infusión de azafrán o colorante alimentario. Dejamos cocer 40 min a fuego medio.",
      },
      {
        title: "Toca el arroz",
        text: "Cuando el caldo lleve un rato podemos apartar un par de cazos de caldo por si acaso luego lo necesitamos. Cuando hayan pasado los 40 min, probamos de sal y corregimos. Echamos el garrofón congelado. Preparamos el arroz, que puede ser bomba, Albufera o Senia. Echamos en forma de cruz y con una paleta removemos el arroz para repartirlo por todas las zonas; una vez repartido ya no tocamos más y a fuego fuerte los primeros 8-10 minutos, luego lo bajamos a fuego bajo y echamos las ramas de romero (5 min). Si nos hace falta caldo echamos del que habíamos apartado (que esté caliente) y lo dejamos en total unos 18 min.",
      },
      {
        title: "Socarrat y reposo",
        text: "La parte final, si queremos socarrat, subimos el fuego para formar esa capa tan rica; cuidado, no vayas a quemarlo (si está negro no es socarrat). Después lo dejamos reposando tapado con periódico o papel albal unos 5 min.",
      },
    ],
    tip: "Una vez repartido el arroz, no lo toques más. Ahí está el secreto.",
  },

  brioche: {
    story:
      "Esta receta seguramente sea con la que más hemos triunfado en muchas de nuestras quedadas con familia y amigos. Un combo ganador que junto con nuestra salsa ajoyaki seguro que podéis triunfar en alguna comida/cena que tengáis. Espero que probéis a hacerla y la disfrutéis.",
    difficulty: "Media",
    ingredients: [
      { qty: "2", name: "Costillares de cerdo" },
      { qty: "1", name: "Cebolla grande" },
      { name: "Pan de tipo brioche" },
      { name: "Especias varias" },
      { qty: "1 hoja", name: "Laurel" },
      { name: "Sal", note: "al gusto" },
      { name: "Salsa barbacoa" },
      { name: "Mantequilla", note: "en trozos" },
      { name: "Miel", note: "chorrito" },
      { qty: "1", name: "Ajo entero", note: "salsa ajoyaki" },
      { name: "Salsa mayonesa", note: "salsa ajoyaki" },
      { name: "Salsa teriyaki", note: "salsa ajoyaki" },
    ],
    steps: [
      {
        title: "Marinar las costillas",
        text: "En una bandeja de horno de cristal o en otro recipiente ponemos salsa barbacoa, perejil, pimienta, pimentón dulce y picante, ajo y cebolla en polvo y sal. Luego extendemos el mejunje por toda la costilla y la dejamos en nevera tapada con film un par de horas. Metemos en la olla express junto con una cebolla pelada y una hoja de laurel, un poco de salsa barbacoa y agua hasta arriba. Tapamos y cuando empiece a salir el vapor bajamos el fuego a medio bajo y dejamos 45 o 50 minutos.",
      },
      {
        title: "Desmenuzar las costillas",
        text: "Abrimos la express para sacar por un lado las costillas y veremos que los huesos salen solos; entonces lo vamos a ir desmenuzando todo y reservando la carne a un lado (revisar bien para quitar huesecitos, cartílagos...). La cebolla la añadimos en toda la carne desmenuzada y lo mezclamos todo. Reservamos y colamos el caldo.",
      },
      {
        title: "La salsa ajoyaki",
        text: "Para hacer esta salsa lo primero será coger un ajo entero y quitar con un corte horizontal la parte superior del ajo. Echamos aceite, sal y lo envolvemos en papel albal. Metemos al horno o airfryer durante 35-40 min a 180°. Pasado el tiempo abrimos y, con cuidado de no quemarnos, presionamos el ajo por los lados para que salga como una crema. Todo en un cuenco al que vamos a poner un par de cucharadas grandes de mayonesa, un poco de cayena, un chorro de salsa teriyaki y pimienta negra. Mezclamos.",
      },
      {
        title: "Brioche y montar",
        text: "En una sartén echamos la carne que necesitemos, un cazo del caldo y que se mezcle; cuando se evapore el caldo echamos bien de barbacoa, removemos y tapamos a fuego lento. Mientras, en otra sartén ponemos mantequilla y doramos por los lados el pan brioche. Abrimos por la mitad y le echamos una cuchara de salsa ajoyaki que la extenderemos para luego meter una cantidad generosa de la carne.",
      },
    ],
    tip: "La salsa ajoyaki es la que lo convierte en un manjar. No la saltes.",
  },

  "tortilla-caramelizada": {
    story:
      "Esta tortilla ya ha sido probada y valorada durante estos años por familia y amigos. La verdad que es una mezcla que queda espectacular. La clave es caramelizar la cebolla de manera natural: lleva mucho más tiempo, pero el resultado es mil veces mejor. ¡Probad a hacerla!",
    difficulty: "Media",
    ingredients: [
      { qty: "1,2 kg", name: "Patatas" },
      { qty: "7", name: "Huevos grandes" },
      { qty: "2", name: "Cebollas grandes" },
      { qty: "1 vasito", name: "Agua" },
      { name: "Aceite de oliva", note: "para freír" },
      { name: "Sal", note: "al gusto" },
    ],
    steps: [
      {
        title: "Caramelizando la cebolla (natural)",
        text: "Corta las cebollas en juliana fina. Cubre la superficie de una cazuela con aceite, echa la cebolla y remueve para juntarlo con el aceite, y echamos un puñado de sal; dejamos tapado a fuego bajo 30 minutos para que sude. Luego destapamos y ya a fuego medio bajo iremos removiendo, vigilando que no se nos agarre (le echamos un poquito de agua si nos pasa). La cebolla cogerá un color dorado y seguiremos removiendo y echando un poco de agua para que siga caramelizando hasta que coja el tono marroncito. Sacamos la cebolla a un colador y reservamos.",
      },
      {
        title: "Freímos las patatas y batimos los huevos",
        text: "En una sartén mediana/grande con el aceite de la cebolla caramelizada y echando un poco más de aceite, vamos a freír nuestras patatas que ya tendremos cortadas en medias láminas de 2 cm y saladas. Las freímos a fuego medio hasta que se queden tiernas y doradas. Mientras, en un bol dejamos batidos 6 huevos y 1 yema. Sacamos las patatas y las escurrimos.",
      },
      {
        title: "Mezclando todos los elementos",
        text: "Añade a las patatas dos cucharadas generosas de la cebolla caramelizada. Vierte el huevo batido poco a poco mientras remueves con cuidado. El objetivo es conseguir una mezcla jugosa: ni muy líquida ni demasiado espesa. Ve añadiendo huevo hasta que veas que tiene la textura ideal. Rectifica de sal.",
      },
      {
        title: "Creamos la tortilla",
        text: "Calienta un poquito de aceite en una sartén antiadherente a fuego medio/alto. Vierte la mezcla y con una espátula de silicona vamos dándole forma por los bordes. Menos de 1 min y le damos la primera vuelta. Repetimos y tenemos que conseguir una tortilla jugosa por dentro, nada de ladrillos.",
      },
    ],
    tip: "Caramelizar la cebolla lleva 2 h, pero es lo que hace especial esta tortilla.",
  },

  brownie: {
    story:
      "¿Tenéis prisa y antojo de chocolate? Esta es vuestra receta. Con unos cuantos ingredientes básicos y un microondas podéis haceros una merienda gocha que calmará vuestras ansias de dulce.",
    note: "Postre no sano ⚠️",
    difficulty: "Fácil",
    ingredients: [
      { qty: "4 cucharadas", name: "Harina" },
      { qty: "4 cucharadas", name: "Azúcar" },
      { qty: "2 cucharadas", name: "Cacao" },
      { qty: "1/2 cucharadita", name: "Levadura" },
      { qty: "1", name: "Huevo" },
      { qty: "3 cucharadas", name: "Leche" },
      { name: "Pepitas de chocolate" },
      { qty: "3 cucharadas", name: "Aceite de girasol" },
    ],
    steps: [
      {
        title: "Mezclar en la taza",
        text: "Lo que vamos a hacer es coger una taza que sea un poco alta porque va a crecer y si no se nos va a desparramar todo. Una vez elegida vamos a mezclar todos los ingredientes secos primero, luego añadimos el huevo, la leche y el aceite de girasol y mezclamos bien.",
      },
      {
        title: "Al microondas",
        text: "Cuando se hayan integrado todos vamos a poner las pepitas de chocolate y llevamos la taza al microondas durante 1 minuto y 30 segundos a máxima potencia.",
      },
      {
        title: "Enfriar y disfrutar",
        text: "Una vez pasado el tiempo lo sacamos, lo dejamos enfriar un poco y nos lo podemos comer en la taza.",
      },
    ],
    tip: "Usa una taza alta: crece bastante y si no se desborda.",
  },

  "tarta-coulant": {
    story:
      "Para los enamorados del chocolate, esta es vuestra tarta. Una combinación de un coulant de chocolate en formato tarta y que al darle un calentón se derrite por dentro. Junto con una bola de helado de vainilla o de turrón vais a rematar una experiencia deliciosa.",
    difficulty: "Media",
    ingredients: [
      { qty: "250 g", name: "Chocolate negro" },
      { qty: "110 g", name: "Azúcar moreno (cassonade)" },
      { qty: "3", name: "Huevos medianos" },
      { qty: "1 pizca", name: "Sal" },
      { qty: "150 g", name: "Mantequilla" },
      { qty: "60 g", name: "Harina" },
    ],
    steps: [
      {
        title: "Fundir y mezclar",
        text: "Primero derretimos el chocolate con la mantequilla; para ello añadimos el chocolate troceado junto con la mantequilla y lo llevamos al microondas unos 30 segundos, sacamos y lo removemos, luego otros 30 segundos al microondas, así hasta que se funda y mezcle todo bien (estas tandas que nunca superen los 30 segundos). Una vez mezclado reservamos a un lado.",
      },
      {
        title: "Mezclar todo",
        text: "En un bol grande mezclamos los huevos con el azúcar. Añadimos la harina tamizada y la sal a la mezcla de huevos y azúcar. Una vez lo mezclemos todo, vamos a incorporar la mezcla de chocolate y mantequilla que habíamos reservado.",
      },
      {
        title: "Hornear y templar",
        text: "Vertemos la masa en un molde de 16 o 18 cm y horneamos a 165 °C durante 30 minutos. Una vez pasado el tiempo lo sacamos y dejamos enfriar a temperatura ambiente, mínimo unos 20 minutos. Después de ese tiempo podemos ponernos un trozo con una bola de helado y a disfrutar.",
      },
      {
        title: "Para guardarla",
        text: "Para guardar la tarta de un día para otro, la metemos en un recipiente hermético y la ponemos en un lugar fresco y seco, que no haya calor o sol. Si la dejamos en la nevera, para que luego al comerla el chocolate de dentro se funda, deberemos calentar cada porción 30 segundos en el microondas antes de comerla.",
      },
    ],
    tip: "30 segundos de microondas antes de comerla y el interior vuelve a derretirse.",
  },

  "tarta-queso": {
    story:
      "Desde que nos independizamos esta receta se ha ido perfeccionando hasta conseguir esa textura cremosa y líquida de los restaurantes, además de un sabor delicioso. Nos encantan todas las variantes que hemos ido probando (hasta una de turrón). Pero aquí os dejamos las 3 clásicas que más hemos hecho en cumples u otros eventos.",
    note: "Hay 3 versiones: Clásica, Lotus y Oreo. Cambia la galleta de la base y lo que se añade a la crema.",
    difficulty: "Media",
    ingredients: [
      { qty: "50 g", name: "Mantequilla", note: "base" },
      { qty: "150 g", name: "Galletas", note: "base: dinosaurios / Lotus / Oreo" },
      { qty: "400 ml", name: "Nata líquida o de montar", note: "crema" },
      { qty: "4", name: "Huevos pequeños", note: "crema" },
      { qty: "500 g", name: "Queso crema", note: "crema" },
      { qty: "150 g", name: "Azúcar", note: "versión clásica" },
      { qty: "96 g", name: "Queso gorgonzola", note: "versión clásica" },
      { qty: "200 g", name: "Crema Lotus", note: "versión Lotus, precalentar en microondas" },
      { qty: "100 g", name: "Relleno Oreo + 50 g galleta + 50 g chocolate blanco", note: "versión Oreo" },
    ],
    steps: [
      {
        title: "Preparando la base",
        text: "Arrugamos y humedecemos un papel de horno y lo estiramos encima del molde. Trituramos bien la galleta elegida y la mezclamos con la mantequilla previamente derretida (1 o 2 veces 30 s al microondas), lo echamos al molde y aplastamos bien con una cuchara para crear la base, y la metemos en el congelador para que endurezca.",
      },
      {
        title: "Preparando la masa",
        text: "Precalentamos el horno a 200 °C. Juntamos todos los ingredientes de la crema en un cuenco (recuerda que dependiendo de qué tarta sea, tienes que añadir unos ingredientes u otros). Se bate todo muy bien hasta que no queden grumos (mejor con batidora de varillas eléctrica). Colamos la crema con un colador en otro cuenco y luego lo vertemos con cuidado en el molde, poniendo una cuchara para que no caiga directamente sobre la base de galleta.",
      },
      {
        title: "Hornear y enfriar",
        text: "Horneamos de 26 a 30 min (dependiendo del horno) a 200 °C y lo sacamos. Lo dejamos reposar fuera 20 min y luego lo metemos al frigo mínimo 4 horas antes de comerla, a poder ser en un táper para tartas o al menos tapada con un papel albal.",
      },
    ],
    tip: "Si al batir salen pompitas, da golpecitos al cuenco contra la mesa: si no, la tarta queda menos cremosa.",
  },

  cookies: {
    story:
      "Para nosotros, una de las peores cosas de hacer galletas es que al poco tiempo se quedan duras. Pero con esta receta ya no tenemos este problema. Son unas galletas estilo New Yorker, crujientes por fuera y blanditas por dentro, la mejor combinación posible. Se puede hacer con KitKat, con Kinder, con Ferrero, lo que más os guste.",
    difficulty: "Media",
    ingredients: [
      { qty: "80 g", name: "Mantequilla fría" },
      { qty: "175 g", name: "Harina tamizada" },
      { qty: "1/2 cucharada", name: "Bicarbonato" },
      { qty: "55 g", name: "Azúcar moreno" },
      { qty: "1", name: "Huevo mediano" },
      { qty: "1 pizca", name: "Sal normal" },
      { qty: "40 g", name: "Azúcar blanco" },
      { qty: "10 g", name: "Maicena" },
      { name: "Sal en escamas" },
      { qty: "1 cucharadita", name: "Esencia de vainilla" },
      { name: "Pepitas de chocolate" },
      { qty: "1/2 cucharada", name: "Levadura" },
      { qty: "1 paquete", name: "Kit Kat o Kinder Maxi" },
    ],
    steps: [
      {
        title: "Juntar y mezclar",
        text: "Juntamos la mantequilla fría con el azúcar blanco y moreno. Juntamos con las manos hasta que el azúcar esté integrado. Añadimos el huevo (también frío) y ya empezamos a mezclar con espátula. Añadimos la esencia de vainilla, la harina, bicarbonato, levadura, maicena y la sal normal. Mezclamos todo hasta que quede una masa homogénea sin harina suelta, y preparamos los toppings.",
      },
      {
        title: "Toppings y bolas",
        text: "Del paquete de KitKat dejaremos apartadas 2 tiras y el resto las cortaremos en cachitos pequeños. Echamos los cachitos de KitKat y las pepitas de chocolate que queramos a la masa de galletas. Mezclaremos todo bien, y haremos 4 bolas de unos 135 gr. Las guardaremos en un táper y las meteremos en el congelador hasta el día siguiente (para que mantengan la forma).",
      },
      {
        title: "Hornear y enfriar",
        text: "Al día siguiente (o cuando vayamos a hacerlas) recalentamos el horno a 200°. Sacamos nuestras bolas y, antes de meter al horno, añadimos un poquito de sal en escamas por encima de cada bola. Las horneamos unos 10-13 minutos en una bandeja con papel de horno por debajo, y las sacamos. Cortamos a la mitad las 2 tiras de KitKat que dejamos apartadas y, cuando todavía estén calientes y blanditas las galletas, les incrustamos a cada una media barra de KitKat. Parecerá que las galletas están crudas, pero están bien, solo hay que dejarlas enfriar.",
      },
      {
        title: "Reposo final",
        text: "Las dejaremos enfriar (media hora mínimo) y ya podremos disfrutar de nuestras riquísimas galletas de KitKat, crujientes por fuera y blanditas por dentro.",
      },
    ],
    tip: "Congela las bolas una noche: así mantienen la forma y quedan blanditas por dentro.",
  },

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
