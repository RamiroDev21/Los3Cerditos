/**
 * La carta de Los Tres Cerditos, transcrita de la carta impresa del restaurante.
 * Es la única fuente de productos y precios del sitio: para cambiar un precio,
 * un nombre o agregar un producto, edita solo este archivo.
 *
 * Precios en pesos colombianos (COP), sin decimales.
 *
 * Correcciones de ortografía hechas al transcribir (revisar con el negocio):
 *  - "salda de la casa" → "salsa de la casa" (Hamburguesa Clásica y Bacon).
 *  - "chorrizo artesanal" → "chorizo artesanal" (Chuzopan Clásico).
 *  - "pimenton" → "pimentón" (Chuzos Desgranados).
 *
 * Las fotos son TEMPORALES (Unsplash, platos parecidos, no los del restaurante).
 * Reemplázalas por fotos reales: cambia `image.src` por una ruta en /public,
 * por ejemplo "/fotos/hamburguesas.jpg".
 */

export type MenuItem = {
  id: string;
  /** Nombre tal como aparece en la carta. */
  name: string;
  description?: string;
  price: number;
  /** Nombre completo para el pedido cuando `name` solo se entiende dentro de su categoría. */
  orderName?: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  /** Texto que la carta pone bajo el título de la categoría (acompañamientos, disponibilidad). */
  note?: string;
  /** Descripción compartida por todos los productos de la categoría. */
  description?: string;
  image: { src: string; alt: string };
  items: MenuItem[];
};

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const menu: MenuCategory[] = [
  {
    id: "hamburguesas",
    name: "Hamburguesas",
    image: {
      src: unsplash("1568901346375-23c9450c58cd"),
      alt: "Hamburguesa con carne, queso derretido, lechuga y tomate sobre fondo oscuro",
    },
    items: [
      {
        id: "hamburguesa-clasica",
        name: "Hamburguesa Clásica",
        description:
          "Pan, carne artesanal de 140g, lechuga crespa, tomate, cebolla caramelizada, queso mozzarella, salsa de la casa.",
        price: 25000,
      },
      {
        id: "hamburguesa-bacon",
        name: "Hamburguesa Bacon",
        description:
          "Pan, carne artesanal de 180g, lechuga crespa, tomate, cebolla caramelizada, queso mozzarella, tocineta, salsa de la casa.",
        price: 32000,
      },
      {
        id: "hamburguesa-costena",
        name: "Hamburguesa Costeña",
        description:
          "Pan, carne artesanal de 180g, cebolla caramelizada, queso costeño asado, queso mozzarella, papa fosforito, salsa de la casa.",
        price: 35000,
      },
      {
        id: "hamburguesa-cheese",
        name: "Hamburguesa Cheese",
        description:
          "Pan, carne artesanal de 180g, cebolla caramelizada, queso mozzarella, queso cheddar, tocineta, salsa de la casa.",
        price: 35000,
      },
      {
        id: "burguer-master",
        name: "Burguer Master",
        description:
          "Pan brioche, carne 180gr, plátano maduro, cebolla caramelizada en salsa de corozo, doble tocineta, queso cheddar.",
        price: 35000,
      },
    ],
  },
  {
    id: "chuzos-desgranados",
    name: "Chuzos Desgranados",
    image: {
      src: unsplash("1599487488170-d11ec9c172f0"),
      alt: "Chuzos de pollo dorándose sobre la parrilla",
    },
    items: [
      {
        id: "chuzo-quillero",
        name: "Chuzo Quillero",
        description:
          "Lechuga, bollo limpio, pollo, pimentón y cebolla (grille), queso costeño rayado, papa ripio, salsa quillera.",
        price: 25000,
      },
      {
        id: "chuzo-quillero-mixto",
        name: "Chuzo Quillero Mixto",
        description:
          "Lechuga, bollo limpio, pollo, lomo de res, pimentón y cebolla (grille), queso costeño rayado, papa ripio, salsa quillera.",
        price: 28000,
      },
    ],
  },
  {
    id: "salchipapa",
    name: "Salchipapa",
    image: {
      src: unsplash("1573080496219-bb080dd4f877"),
      alt: "Papas fritas servidas en canasta con queso rallado",
    },
    items: [
      {
        id: "salchipapa",
        name: "Salchipapa",
        description: "Salchipapa sencilla. Papa frita, lechuga, queso costeño, salchicha y papa ripio.",
        price: 12000,
      },
    ],
  },
  {
    id: "salchimafufo",
    name: "Salchimafufo",
    image: {
      src: unsplash("1630384060421-cb20d0e0649d"),
      alt: "Canasta metálica con papas fritas sobre una tabla de madera",
    },
    items: [
      {
        id: "salchimafufo",
        name: "Salchimafufo",
        description:
          "Mafufo, queso costeño, papitas fosforito, chorizo, salchicha ranchera, tocineta y salsa de tocineta.",
        price: 35000,
      },
    ],
  },
  {
    id: "perro-caliente",
    name: "Perro Caliente",
    image: {
      src: unsplash("1619740455993-9e612b1af08a"),
      alt: "Perro caliente cargado de salsas y toppings sobre papel periódico",
    },
    items: [
      {
        id: "perro-suizo",
        name: "Perro Suizo",
        description:
          "Pan, salchicha suiza, queso mozzarella, cebolla caramelizada, papas fosforitos, salsa de la casa.",
        price: 25000,
      },
    ],
  },
  {
    id: "chuzopanes",
    name: "Chuzopanes",
    image: {
      src: unsplash("1555939594-58d7cb561ad1"),
      alt: "Bandeja con chuzos de pollo y carne a la parrilla, papas y salsas",
    },
    items: [
      {
        id: "chuzopan-clasico",
        name: "Chuzopan Clásico",
        description:
          "Pechuga de pollo 100gr, chorizo artesanal 50gr, butifarra 50gr, papa ripio, queso costeño, salsa de la casa.",
        price: 30000,
      },
      {
        id: "chuzopan-de-pollo",
        name: "Chuzopan de Pollo",
        description: "Pechuga de pollo 200gr, papa ripio, queso costeño, salsa de la casa.",
        price: 32000,
      },
      {
        id: "chuzopan-mixto",
        name: "Chuzopan Mixto",
        description:
          "Pechuga de pollo 70gr, lomo de cerdo 70gr, lomo de res 70gr, papa ripio, queso costeño, salsa de la casa.",
        price: 35000,
      },
    ],
  },
  {
    id: "picadas",
    name: "Picadas",
    description:
      "Papas a la francesa, salchicha premium, carne asada, queso costeño, queso mozzarella, pechuga asada, maíz, papas fosforitos, salsa de la casa.",
    image: {
      src: unsplash("1504674900247-0877df9cc836"),
      alt: "Mesa con varios platos de carnes y acompañamientos para compartir",
    },
    items: [
      { id: "picada-bellaquita", name: "Bellaquita", orderName: "Picada Bellaquita", price: 30000 },
      { id: "picada-bellaca", name: "Bellaca", orderName: "Picada Bellaca", price: 45000 },
    ],
  },
  {
    id: "asados-al-carbon",
    name: "Asados al carbón",
    note: "Acompañados con: bastones de mafufo, porción de papa fritas o bollo. Ensalada especial.",
    image: {
      src: unsplash("1529692236671-f1f6cf9683ba"),
      alt: "Carne asada a la brasa cortada en tajadas sobre una tabla",
    },
    items: [
      { id: "asado-cerdo", name: "Cerdo", orderName: "Asado al carbón de cerdo", price: 35000 },
      { id: "asado-pechuga", name: "Pechuga", orderName: "Asado al carbón de pechuga", price: 35000 },
    ],
  },
  {
    id: "cerdo-a-la-llanera",
    name: "Cerdo a la Llanera",
    note: "Disponible sábados y domingos",
    image: {
      src: unsplash("1544025162-d76694265947"),
      alt: "Costillas de cerdo asadas sobre tabla de madera con tomate y salsas",
    },
    items: [
      {
        id: "llanera-personal",
        name: "Personal",
        description: "250gr, bollo limpio o yuca.",
        orderName: "Cerdo a la Llanera personal",
        price: 30000,
      },
      {
        id: "llanera-para-2",
        name: "Para 2",
        description: "450gr, bollo limpio o yuca.",
        orderName: "Cerdo a la Llanera para 2",
        price: 55000,
      },
    ],
  },
  {
    id: "chorizos",
    name: "Chorizos",
    image: {
      src: unsplash("1527477396000-e27163b481c2"),
      alt: "Chorizos asados servidos en un plato de madera con salsa",
    },
    items: [
      { id: "chorizo-santarrosano", name: "Picada de Chorizo Santarrosano", price: 20000 },
      { id: "chorizo-jalapeno", name: "Picada de Chorizo Jalapeño", price: 20000 },
    ],
  },
  {
    id: "adicionales",
    name: "Adicionales",
    image: {
      src: unsplash("1630384060421-cb20d0e0649d"),
      alt: "Porción de papas a la francesa en canasta metálica",
    },
    items: [
      { id: "adicional-papa-francesa", name: "Papa a la francesa", price: 6000 },
      { id: "adicional-mafufo", name: "Mafufo", price: 6000 },
      { id: "adicional-mafufo-fantasma", name: "Mafufo fantasma", price: 8000 },
      { id: "adicional-papas-fantasma", name: "Papas fantasma", price: 8000 },
      { id: "adicional-bollo-fantasma", name: "Picada de bollo fantasma", price: 8000 },
    ],
  },
  {
    id: "bebidas",
    name: "Bebidas",
    image: {
      src: unsplash("1581636625402-29b2a704ef13"),
      alt: "Vaso de gaseosa con hielo",
    },
    items: [
      { id: "gaseosa-personal", name: "Gaseosa personal", price: 6000 },
      { id: "botella-agua", name: "Botella de agua", price: 5000 },
      { id: "soda-panelada", name: "Soda panelada", price: 6000 },
      { id: "soda-saborizada", name: "Soda saborizada", price: 10000 },
    ],
  },
];

/**
 * Productos de la sección "Para empezar": uno por familia de la carta, para
 * mostrar su variedad. No es un ranking de ventas.
 */
export const featured: { itemId: string; image: { src: string; alt: string } }[] = [
  {
    itemId: "hamburguesa-costena",
    image: {
      src: unsplash("1553979459-d2229ba7433b"),
      alt: "Hamburguesa doble con queso derretido y tocineta",
    },
  },
  {
    itemId: "chuzo-quillero",
    image: { src: unsplash("1599487488170-d11ec9c172f0"), alt: "Chuzos de pollo dorándose sobre la parrilla" },
  },
  {
    itemId: "salchimafufo",
    image: { src: unsplash("1573080496219-bb080dd4f877"), alt: "Papas fritas cargadas servidas en canasta" },
  },
  {
    itemId: "perro-suizo",
    image: {
      src: unsplash("1619740455993-9e612b1af08a"),
      alt: "Perro caliente cargado de salsas y toppings",
    },
  },
  {
    itemId: "picada-bellaca",
    image: {
      src: unsplash("1555939594-58d7cb561ad1"),
      alt: "Bandeja de picada con carnes asadas, papas y salsas",
    },
  },
  {
    itemId: "llanera-personal",
    image: { src: unsplash("1544025162-d76694265947"), alt: "Cerdo asado sobre tabla de madera" },
  },
];

const index = new Map<string, { item: MenuItem; category: MenuCategory }>();
for (const category of menu) for (const item of category.items) index.set(item.id, { item, category });

export function findItem(id: string) {
  return index.get(id);
}

/** Nombre completo para mostrar fuera de la carta y en el mensaje de WhatsApp. */
export function fullName(item: MenuItem) {
  return item.orderName ?? item.name;
}

/** Formato de la carta: $25.000 y $6.000 (Intl en español no agrupa los miles de 4 cifras). */
export function formatPrice(value: number) {
  return `$${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

/** Stock photos stand in until the restaurant's own photos arrive; the UI labels them as such. */
export function isReferencePhoto(src: string) {
  return src.startsWith("https://images.unsplash.com");
}
