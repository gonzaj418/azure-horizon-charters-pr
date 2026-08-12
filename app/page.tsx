"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Language = "en" | "es";

type PublicReview = {
  id: number;
  guestName: string;
  rating: number;
  comment: string;
  language: string;
};

const galleryImages = Array.from({ length: 41 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    full: `/images/gallery/${number}-full.webp`,
    thumb: `/images/gallery/${number}-thumb.webp`,
  };
});

type BoatId = "mako24" | "hydra28" | "hydra33" | "grady38" | "stamas42";

const stripePaymentLinks: Partial<Record<`${BoatId}:${string}`, string>> = {
  "mako24:fishing-5h": "https://book.stripe.com/aFa5kw3Lg93ldMN4kl8Vi02",
  "mako24:island-6h": "https://book.stripe.com/7sY7sE0z44N56kl5op8Vi03",
  "hydra28:island-4h": "https://book.stripe.com/14A14g5To0wP5gh5op8Vi00",
  "hydra28:island-6h": "https://book.stripe.com/bJe8wI1D8frJgYZ6st8Vi01",
  "hydra33:island-4h": "https://book.stripe.com/aFa6oA2Hcbbt389g338Vi04",
  "hydra33:island-6h": "https://book.stripe.com/dRm3co95AgvN8st8AB8Vi05",
  "grady38:island-4h": "https://book.stripe.com/6oUfZa81w1ATeQR0458Vi06",
  "grady38:island-6h": "https://book.stripe.com/eVq8wIdlQ4N5cIJbMN8Vi07",
  "stamas42:island-4h": "https://book.stripe.com/fZucMYdlQgvNcIJaIJ8Vi08",
  "stamas42:island-6h": "https://book.stripe.com/8x23co1D8frJ245g338Vi09",
};

type BookingBoat = {
  image: string;
  maxGuests: number;
  name: string;
  trips: Array<{
    id: string;
    labelEn: string;
    labelEs: string;
    price: number;
  }>;
};

const bookingBoats: Record<BoatId, BookingBoat> = {
  mako24: {
    image: "/images/mako24.webp",
    maxGuests: 6,
    name: "Mako 26",
    trips: [
      { id: "fishing-5h", labelEn: "5-hour fishing charter", labelEs: "Charter de pesca · 5 horas", price: 850 },
      { id: "island-6h", labelEn: "6-hour island charter", labelEs: "Paseo a la isla · 6 horas", price: 850 },
    ],
  },
  hydra28: {
    image: "/images/hydra28.webp",
    maxGuests: 6,
    name: "Hydra-Sports 28",
    trips: [
      { id: "island-4h", labelEn: "4-hour island charter", labelEs: "Paseo a la isla · 4 horas", price: 650 },
      { id: "island-6h", labelEn: "6-hour island charter", labelEs: "Paseo a la isla · 6 horas", price: 850 },
    ],
  },
  hydra33: {
    image: "/images/hydra33.webp",
    maxGuests: 10,
    name: "Hydra-Sports 33",
    trips: [
      { id: "island-4h", labelEn: "4-hour island charter", labelEs: "Paseo a la isla · 4 horas", price: 850 },
      { id: "island-6h", labelEn: "6-hour island charter", labelEs: "Paseo a la isla · 6 horas", price: 1100 },
    ],
  },
  grady38: {
    image: "/images/grady38.webp",
    maxGuests: 10,
    name: "Grady-White 38",
    trips: [
      { id: "island-4h", labelEn: "4-hour island charter", labelEs: "Paseo a la isla · 4 horas", price: 1100 },
      { id: "island-6h", labelEn: "6-hour island charter", labelEs: "Paseo a la isla · 6 horas", price: 1400 },
    ],
  },
  stamas42: {
    image: "/images/stamas42.webp",
    maxGuests: 10,
    name: "Stamas 42",
    trips: [
      { id: "island-4h", labelEn: "4-hour island charter", labelEs: "Paseo a la isla · 4 horas", price: 1100 },
      { id: "island-6h", labelEn: "6-hour island charter", labelEs: "Paseo a la isla · 6 horas", price: 1400 },
    ],
  },
};

const copy = {
  en: {
    promo: "2026 Fajardo charter specials · Private trips from $650",
    nav: ["Fleet", "Packages", "Destinations", "Gallery", "FAQ"],
    language: "Español",
    eyebrow: "PRIVATE BOAT CHARTERS · FAJARDO, PUERTO RICO",
    heroTitle: "Your island day, matched to the right boat.",
    heroText:
      "Tell us your date, group size and destination. We compare available boats and send you the best options — one request, no guesswork.",
    quote: "Get my boat options",
    fleetCta: "See boats & prices",
    trust: ["Private boat", "Captain included", "Fuel included", "Villa Marina meeting point"],
    plannerTitle: "Find your best option",
    plannerText: "All trips meet at Villa Marina, Fajardo. Send one request and receive available options.",
    date: "Preferred date",
    guests: "Guests",
    destination: "Destination",
    duration: "Duration",
    selectDate: "Choose a date",
    groupOptions: ["1–2 guests", "3–4 guests", "5–6 guests", "7–10 guests"],
    destinations: ["Icacos", "Palomino", "Culebra / Vieques", "Fishing charter", "Help me choose"],
    durations: ["4 hours", "5-hour fishing", "6 hours", "Custom trip"],
    from: "Trips from",
    availability: "Final boat, authorized capacity and price are confirmed before deposit.",
    fleetEyebrow: "CHOOSE YOUR STYLE",
    fleetTitle: "Five clear options. More boats on request.",
    fleetText:
      "Start with the best-value boat or step up for more space and power. We confirm the operating captain and exact vessel before you reserve.",
    bestValue: "BEST VALUE",
    moreSpace: "MORE SPACE",
    premium: "2021 PREMIUM",
    hydra28Name: "Hydra-Sports 28",
    hydra28Sub: "White center console · Repowered with twin Yamaha 225",
    hydra28Fit: "A smart pick for couples, families and private groups up to 6.",
    hydra33Name: "Hydra-Sports 33",
    hydra33Sub: "Blue center console · Triple Yamaha 225",
    hydra33Fit: "More deck space and power for a roomier private island day for groups up to 10.",
    recentPhotos: "Recent real photos",
    gradyName: "Grady-White 38",
    gradySub: "2021 premium boat · Triple Yamaha 300",
    gradyFit: "A newer premium option with exceptional space and comfort for groups up to 10.",
    stamasTag: "42' CRUISER",
    stamasName: "Stamas 42",
    stamasSub: "Spacious cruiser · Twin inboard diesel engines",
    stamasFit: "A comfortable cruiser-style option with cabin space for groups up to 10.",
    makoTag: "FISHING + ISLAND",
    makoName: "Mako 26",
    makoSub: "26-foot center console · Yamaha 200",
    makoFit: "Its smaller size reaches shallow, tucked-away places larger boats cannot. The captain is known for personal service, flexible routes and surprise extra stops when conditions allow.",
    makoMarina: "Guest pickup at Villa Marina, Fajardo",
    smallGroup: "UP TO 6 GUESTS",
    fiveFishing: "5h fishing",
    sixCharter: "6h island charter",
    makoIncluded: [
      "Fishing or island-day option",
      "Palominito, Isleta Marina and calm-water Cayo Ramos options",
      "Hidden-beach stops near Cayo Lobos when safe and legally accessible",
      "Captain and fuel for the confirmed route",
      "Villa Marina guest pickup",
      "No 4-hour departure",
    ],
    upToTen: "UP TO 10 GUESTS*",
    capacityNote:
      "*Final guest capacity is confirmed before deposit according to the selected vessel, documentation and authorized operating arrangement.",
    marina: "Departs Villa Marina, Fajardo",
    fourHours: "4 hours",
    sixHours: "6 hours",
    reserve: "Reserve this boat",
    depositTag: "RESERVE WITH 30%",
    bookingTitle: "Request your reservation",
    bookingIntro: "Choose your trip details and see the exact deposit before continuing.",
    selectTrip: "Trip option",
    bookingDate: "Preferred date",
    bookingTime: "Preferred departure time",
    bookingGuests: "Guests",
    fullName: "Full name",
    email: "Email",
    phone: "Phone / WhatsApp",
    paymentMethod: "Preferred payment method",
    paymentOptions: ["Card / Apple Pay", "Venmo", "ATH Móvil", "PayPal"],
    totalPrice: "Total trip price",
    depositDue: "30% deposit",
    remainingBalance: "Balance due trip day",
    bookingAgreement:
      "I accept the 48-hour cancellation policy and understand that the vessel, operator and availability must be confirmed.",
    sendReservation: "Send reservation request",
    noChargeYet: "No payment is collected on this screen. We will send secure payment instructions after confirming availability.",
    paymentEyebrow: "SIMPLE RESERVATIONS",
    paymentTitle: "Secure your date with a 30% deposit.",
    paymentText:
      "Select your boat, date and trip. You will see the full price, exact deposit and remaining balance before sending the request.",
    paymentCards: [
      ["30% deposit", "The remaining balance is due on the day of the trip."],
      ["48-hour cancellation", "Full refund when cancelled at least 48 hours before departure."],
      ["Unsafe weather", "Choose a full refund or reschedule when conditions prevent the trip."],
      ["Flexible payments", "Card and Apple Pay are preferred; Venmo, ATH Móvil and PayPal are also available."],
    ],
    pendingConfirmation:
      "A request is not final until the selected boat, authorized operator and availability are confirmed. We respond within 24 hours.",
    includedShort: ["Captain & fuel", "Ice-cold drinks", "Snacks", "Cooler with ice"],
    allInclusive: "WHAT YOUR DAY INCLUDES",
    packageTitle: "Four hours to escape. Six hours to make a day of it.",
    packageText:
      "Both trips are private and all-inclusive. The six-hour experience adds a full meal and more time to swim, relax and explore.",
    escape: "Island Escape",
    escapeSub: "4 hours · From $650",
    escapeList: [
      "Private boat and designated captain",
      "Fuel for the confirmed local route",
      "Cooler with ice",
      "Water, soft drinks and local beer",
      "Light snacks",
    ],
    full: "Full Island Experience",
    fullSub: "6 hours · From $850",
    fullList: [
      "Everything in the 4-hour package",
      "A full prepared meal",
      "More swimming and beach time",
      "Flexible local itinerary",
      "Best overall value",
    ],
    mealNote: "Meal selection is confirmed with your booking.",
    clearKicker: "FAJARDO",
    clearTitle: "Clear water. Private pace.",
    placesEyebrow: "FROM FAJARDO",
    placesTitle: "Pick the vibe. We’ll match the route.",
    places: [
      ["Icacos", "Turquoise water, sandbar time and easy snorkeling."],
      ["Palomino", "A social stop where boats gather, music plays and groups enjoy the water."],
      ["Culebra · Culebrita", "Tortuga Beach: clear water, white sand and one of Puerto Rico’s most beautiful island escapes."],
    ],
    culebraEyebrow: "A CULEBRA DAY",
    culebraTitle: "More than one beautiful stop",
    culebraIntro: "A custom Culebra route can combine scenic arrivals, town time, marine life and an unforgettable beach day — always adjusted to weather and sea conditions.",
    culebraHighlights: [
      ["Arrival", "Culebra entrance", "The colorful welcome point seen as the boat approaches town."],
      ["Town", "Culebra bay", "A waterfront arrival with a view of the town and docks."],
      ["Marine life", "Mamacita’s dock", "Tarpon are often visible in the clear water beside the restaurant dock."],
      ["Culebrita", "Tortuga Beach", "Clear shallows, white sand and the signature full-day Culebra experience."],
    ],
    luisPenaTitle: "Cayo Luis Peña · closer Culebra option",
    luisPenaText: "A beautiful stop on Culebra’s west side, approximately 1 hour from Villa Marina. Route availability depends on the selected boat and sea conditions.",
    luisPenaPhoto: "CAYO LUIS PEÑA",
    distanceEyebrow: "ROUTE GUIDE",
    distanceTitle: "Approximate travel times from Villa Marina",
    distanceNote: "Travel times vary by vessel, selected route, wind and sea conditions. Culebra, Culebrita and Vieques require a custom quote.",
    distanceGuide: [
      ["Icacos", "15–20 min", "Turquoise sandbar · snorkeling · more time in the water"],
      ["Palomino", "15–20 min", "Beach · social atmosphere · great for families and groups"],
      ["Cayo Luis Peña", "About 1 hr", "West coast of Culebra · turquoise water · custom route and quote"],
      ["Culebra", "About 1 hr", "Full-day adventure · custom route and quote"],
      ["Culebrita", "About 1.5 hrs", "Tortuga Beach · natural pools · full day recommended"],
      ["Vieques", "About 1 hr", "Wild beaches · full-day route · custom quote"],
    ],
    galleryEyebrow: "REAL TRIPS · REAL GUESTS",
    galleryTitle: "This is what an Azure Horizon day looks like.",
    galleryText: "Browse 41 real moments from our trips around Fajardo and Puerto Rico’s eastern islands.",
    galleryCount: "41 real trip photos",
    galleryOpenAll: "View all 41 photos",
    galleryShowLess: "Show fewer photos",
    reviewsEyebrow: "SHARED BY OUR GUESTS",
    reviewsTitle: "Memories that speak for themselves.",
    reviewsNote: "Comments previously shared with Azure Horizon Charters.",
    reviews: [
      ["Tremendous Experience!!!!!", "Erick D."],
      ["Amazing experience. We saw turtles and hidden beaches. 100% recommended.", "Laura G."],
      ["The captain was super kind, the boat was spotless, and the sunset... wow.", "Andrew M."],
      ["The highlight of our Puerto Rico trip. Would book again in a heartbeat.", "Mark & Julia"],
      ["Great service... best captain in Fajardo.", "Willi L."],
    ],
    feedbackTitle: "Did you travel with us? Share your experience.",
    feedbackText: "Your review stays private until we confirm the trip and approve it. Your email or phone is used only for verification and is never displayed.",
    feedbackName: "Name",
    feedbackTripDate: "Trip date",
    feedbackContact: "Booking email or phone",
    feedbackRating: "Rating",
    feedbackComment: "Your experience",
    feedbackConsent: "I authorize Azure Horizon Charters to publish my comment and abbreviated name after verification.",
    feedbackSubmit: "Send for review",
    feedbackSending: "Sending...",
    feedbackSuccess: "Thank you. Your feedback was received and is pending verification.",
    feedbackError: "We could not send your feedback. Please try again.",
    experienceEyebrow: "REAL PUERTO RICO DAYS",
    experienceTitle: "The boat is only the beginning.",
    experienceText:
      "Music, cold drinks, clear water, fresh food and the freedom to enjoy the day at your own pace.",
    reasons: [
      ["One request, several options", "We do the boat matching for you."],
      ["Clear starting prices", "Know the budget before you message."],
      ["Local coordination", "Direct help before and during booking."],
      ["Private experience", "Only your confirmed group is aboard."],
    ],
    howTitle: "From boat selection to marina in three easy steps",
    steps: [
      ["1", "Choose your boat", "Select the vessel and trip duration that fit your group."],
      ["2", "Send your details", "Enter the date, departure time, guests and contact information."],
      ["3", "Secure the date", "After availability is confirmed, pay the exact 30% deposit."],
    ],
    faqTitle: "Good to know before you book",
    faqs: [
      [
        "Is the price per person?",
        "No. Starting prices are for a private boat. Final capacity and price depend on the selected vessel and authorized passenger limit.",
      ],
      [
        "What is included?",
        "Four-hour trips normally include the captain, fuel for the confirmed local route, ice, water, soft drinks, local beer and snacks. Six-hour trips add a full meal.",
      ],
      [
        "How do I reserve?",
        "Choose a boat and trip, send your date and contact details, then secure the date with a 30% deposit after availability is confirmed. The remaining balance is due on the trip day.",
      ],
      [
        "What is the cancellation policy?",
        "Receive a full refund when you cancel at least 48 hours before departure. If unsafe weather prevents the trip, choose a full refund or a new date.",
      ],
      [
        "Can I book Culebra or Vieques?",
        "Yes, when weather and the selected boat allow it. Those routes receive a custom quote because fuel use and trip duration vary.",
      ],
      [
        "Which boat will I receive?",
        "We confirm the exact vessel, photos, licensed operating captain, authorized capacity, marina and terms before you place a deposit.",
      ],
      [
        "Do you offer fishing charters?",
        "Yes. The Mako 26 offers a five-hour fishing charter from $850 for up to 6 guests. Fishing details and the final trip plan are confirmed before deposit.",
      ],
      [
        "Where do the trips depart?",
        "All listed trips meet at Villa Marina in Fajardo, Puerto Rico. The Mako is trailer-kept, but guest pickup is still at Villa Marina. We send exact instructions with your confirmation.",
      ],
    ],
    finalTitle: "Ready for your private island day?",
    finalText: "Send your group details and receive available boat options on WhatsApp.",
    finalCta: "Get options on WhatsApp",
    kayakLabel: "FEATURED TRAVEL GUIDE",
    kayakText: "Azure Horizon Charters is featured in the KAYAK Fajardo Travel Guide.",
    kayakCta: "View the KAYAK guide",
    contact: "Villa Marina, Fajardo, Puerto Rico · 787-473-4037",
    legal:
      "Availability, destination, weather, vessel, operator and authorized passenger capacity are confirmed before payment. Some trips are fulfilled by independent vessel operators.",
  },
  es: {
    promo: "Especiales 2026 desde Fajardo · Viajes privados desde $650",
    nav: ["Flota", "Paquetes", "Destinos", "Galería", "Preguntas"],
    language: "English",
    eyebrow: "CHARTERS PRIVADOS · FAJARDO, PUERTO RICO",
    heroTitle: "Tu día de isla, en el bote correcto.",
    heroText:
      "Dinos la fecha, cantidad de personas y destino. Comparamos los botes disponibles y te enviamos las mejores opciones en una sola solicitud.",
    quote: "Recibir opciones de botes",
    fleetCta: "Ver botes y precios",
    trust: ["Bote privado", "Capitán incluido", "Combustible incluido", "Encuentro en Villa Marina"],
    plannerTitle: "Encuentra tu mejor opción",
    plannerText: "Todos los viajes se encuentran en Villa Marina, Fajardo. Envía una solicitud y recibe las opciones disponibles.",
    date: "Fecha preferida",
    guests: "Personas",
    destination: "Destino",
    duration: "Duración",
    selectDate: "Escoge una fecha",
    groupOptions: ["1–2 personas", "3–4 personas", "5–6 personas", "7–10 personas"],
    destinations: ["Icacos", "Palomino", "Culebra / Vieques", "Charter de pesca", "Ayúdame a escoger"],
    durations: ["4 horas", "Pesca 5 horas", "6 horas", "Viaje personalizado"],
    from: "Viajes desde",
    availability: "El bote, la capacidad autorizada y el precio final se confirman antes del depósito.",
    fleetEyebrow: "ESCOGE TU ESTILO",
    fleetTitle: "Cinco opciones claras. Más botes por cotización.",
    fleetText:
      "Comienza con el mejor precio o sube a una embarcación con más espacio y potencia. Confirmamos capitán y bote exacto antes de reservar.",
    bestValue: "MEJOR PRECIO",
    moreSpace: "MÁS ESPACIO",
    premium: "PREMIUM 2021",
    hydra28Name: "Hydra-Sports 28",
    hydra28Sub: "Center console blanca · Remotorizada con 2 Yamaha 225",
    hydra28Fit: "Excelente para parejas, familias y grupos privados de hasta 6.",
    hydra33Name: "Hydra-Sports 33",
    hydra33Sub: "Center console azul · 3 Yamaha 225",
    hydra33Fit: "Más espacio y potencia para disfrutar cómodamente el día de isla en grupos de hasta 10.",
    recentPhotos: "Fotos reales recientes",
    gradyName: "Grady-White 38",
    gradySub: "Bote premium 2021 · 3 Yamaha 300",
    gradyFit: "Una opción moderna y premium con excelente espacio y comodidad para grupos de hasta 10.",
    stamasTag: "CRUISER 42'",
    stamasName: "Stamas 42",
    stamasSub: "Cruiser espaciosa · 2 motores diésel inboard",
    stamasFit: "Una opción cómoda tipo cruiser con cabina para grupos de hasta 10.",
    makoTag: "PESCA + ISLA",
    makoName: "Mako 26",
    makoSub: "Center console de 26 pies · Yamaha 200",
    makoFit: "Por su tamaño puede entrar a rincones poco profundos y escondidos donde los botes grandes no llegan. Su capitán se distingue por el trato personal, rutas flexibles y paradas extra cuando las condiciones lo permiten.",
    makoMarina: "Recogido de pasajeros en Villa Marina, Fajardo",
    smallGroup: "HASTA 6 PERSONAS",
    fiveFishing: "Pesca 5 horas",
    sixCharter: "Paseo 6 horas",
    makoIncluded: [
      "Opción de pesca o día de isla",
      "Opciones de Palominito, Isleta Marina y Cayo Ramos para aguas calmadas",
      "Paradas en playas escondidas cerca de Cayo Lobos cuando sea seguro y legalmente accesible",
      "Capitán y combustible para la ruta confirmada",
      "Recogido de pasajeros en Villa Marina",
      "No ofrece salida de 4 horas",
    ],
    upToTen: "HASTA 10 PERSONAS*",
    capacityNote:
      "*La capacidad final se confirma antes del depósito según la embarcación, su documentación y la operación autorizada.",
    marina: "Salida desde Villa Marina, Fajardo",
    fourHours: "4 horas",
    sixHours: "6 horas",
    reserve: "Reservar este bote",
    depositTag: "RESERVA CON 30%",
    bookingTitle: "Solicita tu reservación",
    bookingIntro: "Escoge los detalles del viaje y mira el depósito exacto antes de continuar.",
    selectTrip: "Opción de viaje",
    bookingDate: "Fecha preferida",
    bookingTime: "Hora de salida preferida",
    bookingGuests: "Personas",
    fullName: "Nombre completo",
    email: "Correo electrónico",
    phone: "Teléfono / WhatsApp",
    paymentMethod: "Método de pago preferido",
    paymentOptions: ["Tarjeta / Apple Pay", "Venmo", "ATH Móvil", "PayPal"],
    totalPrice: "Precio total",
    depositDue: "Depósito de 30%",
    remainingBalance: "Balance el día del viaje",
    bookingAgreement:
      "Acepto la política de cancelación de 48 horas y entiendo que se debe confirmar el bote, operador y disponibilidad.",
    sendReservation: "Enviar solicitud de reserva",
    noChargeYet: "No se cobra en esta pantalla. Enviaremos las instrucciones de pago seguras después de confirmar disponibilidad.",
    paymentEyebrow: "RESERVA SENCILLA",
    paymentTitle: "Separa tu fecha con un depósito de 30%.",
    paymentText:
      "Escoge el bote, fecha y viaje. Verás el precio completo, depósito exacto y balance antes de enviar la solicitud.",
    paymentCards: [
      ["30% de depósito", "El balance restante se paga el día del viaje."],
      ["Cancelación de 48 horas", "Reembolso completo al cancelar 48 horas o más antes de la salida."],
      ["Clima peligroso", "Reembolso completo o cambio de fecha cuando las condiciones impidan el viaje."],
      ["Pagos flexibles", "Preferimos tarjeta y Apple Pay; también aceptamos Venmo, ATH Móvil y PayPal."],
    ],
    pendingConfirmation:
      "La solicitud no es final hasta confirmar el bote, operador autorizado y disponibilidad. Respondemos dentro de 24 horas.",
    includedShort: ["Capitán y gasolina", "Bebidas frías", "Picadera", "Nevera con hielo"],
    allInclusive: "TODO LO QUE INCLUYE",
    packageTitle: "Cuatro horas para escapar. Seis para disfrutar el día completo.",
    packageText:
      "Ambos viajes son privados y todo incluido. La experiencia de seis horas añade una comida fuerte y más tiempo para nadar y relajarse.",
    escape: "Escape a la Isla",
    escapeSub: "4 horas · Desde $650",
    escapeList: [
      "Bote privado y capitán designado",
      "Combustible para la ruta local confirmada",
      "Nevera con hielo",
      "Agua, refrescos y cerveza local",
      "Picadera",
    ],
    full: "Experiencia Completa",
    fullSub: "6 horas · Desde $850",
    fullList: [
      "Todo lo incluido en 4 horas",
      "Una comida fuerte preparada",
      "Más tiempo de playa y natación",
      "Itinerario local flexible",
      "La mejor relación entre tiempo y precio",
    ],
    mealNote: "La selección de comida se confirma al reservar.",
    clearKicker: "FAJARDO",
    clearTitle: "Agua cristalina. A tu propio ritmo.",
    placesEyebrow: "SALIENDO DE FAJARDO",
    placesTitle: "Escoge el ambiente. Nosotros coordinamos la ruta.",
    places: [
      ["Icacos", "Agua turquesa, banco de arena y snorkeling."],
      ["Palomino", "Una parada social con botes juntos, música y ambiente de vacilón sobre el agua."],
      ["Culebra · Culebrita", "Playa Tortuga: agua cristalina, arena blanca y uno de los escapes más bellos de Puerto Rico."],
    ],
    culebraEyebrow: "UN DÍA EN CULEBRA",
    culebraTitle: "Más de una parada espectacular",
    culebraIntro: "Una ruta personalizada por Culebra puede combinar la llegada panorámica, tiempo en el pueblo, vida marina y un día inolvidable de playa, siempre ajustado al clima y al mar.",
    culebraHighlights: [
      ["Llegada", "Entrada a Culebra", "El colorido punto de bienvenida que se observa al acercarse al pueblo en bote."],
      ["Pueblo", "Bahía de Culebra", "Una llegada por agua con vista al pueblo y sus muelles."],
      ["Vida marina", "Muelle de Mamacita’s", "En el agua clara junto al restaurante suelen verse sábalos."],
      ["Culebrita", "Playa Tortuga", "Bajíos cristalinos, arena blanca y la experiencia emblemática de un día completo en Culebra."],
    ],
    luisPenaTitle: "Cayo Luis Peña · opción más cercana de Culebra",
    luisPenaText: "Una parada preciosa al oeste de Culebra, aproximadamente a 1 hora desde Villa Marina. La ruta depende del bote seleccionado y las condiciones del mar.",
    luisPenaPhoto: "CAYO LUIS PEÑA",
    distanceEyebrow: "GUÍA DE RUTAS",
    distanceTitle: "Tiempos aproximados desde Villa Marina",
    distanceNote: "Los tiempos cambian según el bote, la ruta seleccionada, el viento y las condiciones del mar. Culebra, Culebrita y Vieques llevan cotización personalizada.",
    distanceGuide: [
      ["Icacos", "15–20 min", "Banco de arena turquesa · snorkeling · más tiempo en el agua"],
      ["Palomino", "15–20 min", "Playa · ambiente social · ideal para familias y grupos"],
      ["Cayo Luis Peña", "Aprox. 1 hora", "Costa oeste de Culebra · agua turquesa · ruta y cotización personalizada"],
      ["Culebra", "Aprox. 1 hora", "Aventura de día completo · ruta y cotización personalizada"],
      ["Culebrita", "Aprox. 1.5 horas", "Playa Tortuga · piscinas naturales · se recomienda día completo"],
      ["Vieques", "Aprox. 1 hora", "Playas naturales · ruta de día completo · cotización personalizada"],
    ],
    galleryEyebrow: "VIAJES REALES · PASAJEROS REALES",
    galleryTitle: "Así se vive un día con Azure Horizon.",
    galleryText: "Recorre 41 momentos reales de nuestros viajes por Fajardo y las islas del este de Puerto Rico.",
    galleryCount: "41 fotos reales de nuestros viajes",
    galleryOpenAll: "Ver las 41 fotos",
    galleryShowLess: "Mostrar menos fotos",
    reviewsEyebrow: "COMPARTIDO POR NUESTROS PASAJEROS",
    reviewsTitle: "Recuerdos que hablan por sí solos.",
    reviewsNote: "Comentarios compartidos anteriormente con Azure Horizon Charters.",
    reviews: [
      ["¡Tremenda experiencia!", "Erick D."],
      ["Experiencia increíble. Vimos tortugas y playas escondidas. 100% recomendado.", "Laura G."],
      ["El capitán fue súper amable, el bote estaba impecable y el atardecer... wow.", "Andrew M."],
      ["Lo mejor de nuestro viaje a Puerto Rico. Volveríamos a reservar sin pensarlo.", "Mark & Julia"],
      ["Excelente servicio... el mejor capitán de Fajardo.", "Willi L."],
    ],
    feedbackTitle: "¿Viajaste con nosotros? Comparte tu experiencia.",
    feedbackText: "Tu comentario queda privado hasta que confirmemos el viaje y lo aprobemos. Tu correo o teléfono solo se usa para verificar y nunca se muestra.",
    feedbackName: "Nombre",
    feedbackTripDate: "Fecha del viaje",
    feedbackContact: "Correo o teléfono usado para reservar",
    feedbackRating: "Calificación",
    feedbackComment: "Tu experiencia",
    feedbackConsent: "Autorizo a Azure Horizon Charters a publicar mi comentario y nombre abreviado después de verificar el viaje.",
    feedbackSubmit: "Enviar para revisión",
    feedbackSending: "Enviando...",
    feedbackSuccess: "Gracias. Recibimos tu comentario y está pendiente de verificación.",
    feedbackError: "No pudimos enviar tu comentario. Intenta nuevamente.",
    experienceEyebrow: "DÍAS REALES EN PUERTO RICO",
    experienceTitle: "El bote es solo el comienzo.",
    experienceText:
      "Música, bebidas frías, agua cristalina, comida fresca y libertad para disfrutar a tu propio ritmo.",
    reasons: [
      ["Una solicitud, varias opciones", "Nosotros buscamos el bote adecuado."],
      ["Precios claros desde el inicio", "Conoce el presupuesto antes de escribir."],
      ["Coordinación local", "Ayuda directa antes y durante la reserva."],
      ["Experiencia privada", "Solamente viaja tu grupo confirmado."],
    ],
    howTitle: "De escoger el bote a la marina en tres pasos",
    steps: [
      ["1", "Escoge el bote", "Selecciona la embarcación y duración adecuada para tu grupo."],
      ["2", "Envía los detalles", "Incluye fecha, hora de salida, personas e información de contacto."],
      ["3", "Separa la fecha", "Luego de confirmar disponibilidad, paga el depósito exacto de 30%."],
    ],
    faqTitle: "Lo que debes saber antes de reservar",
    faqs: [
      [
        "¿El precio es por persona?",
        "No. Los precios iniciales son por el bote privado. La capacidad y precio final dependen de la embarcación seleccionada y su límite autorizado.",
      ],
      [
        "¿Qué está incluido?",
        "Las cuatro horas normalmente incluyen capitán, combustible para la ruta local confirmada, hielo, agua, refrescos, cerveza local y picadera. Las seis horas añaden una comida fuerte.",
      ],
      [
        "¿Cómo reservo?",
        "Escoge el bote y viaje, envía la fecha y tus datos, y luego separa la fecha con un depósito de 30% después de confirmar disponibilidad. El balance se paga el día del viaje.",
      ],
      [
        "¿Cuál es la política de cancelación?",
        "Recibe un reembolso completo al cancelar 48 horas o más antes de la salida. Si el clima peligroso impide el viaje, puedes escoger reembolso completo o una nueva fecha.",
      ],
      [
        "¿Puedo reservar Culebra o Vieques?",
        "Sí, cuando el clima y la embarcación lo permitan. Esas rutas llevan cotización personalizada porque cambia el combustible y la duración.",
      ],
      [
        "¿Qué bote recibiré?",
        "Confirmamos embarcación, fotos, capitán operador con licencia, capacidad autorizada, marina y términos antes de que pagues un depósito.",
      ],
      [
        "¿Ofrecen charter de pesca?",
        "Sí. La Mako 26 ofrece un charter de pesca de cinco horas desde $850 para hasta 6 personas. Los detalles de pesca y el plan final se confirman antes del depósito.",
      ],
      [
        "¿Desde dónde salen los viajes?",
        "Todos los viajes publicados se encuentran en Villa Marina, Fajardo. La Mako se transporta en carreta, pero recoge a los pasajeros en Villa Marina. Enviamos las instrucciones exactas con la confirmación.",
      ],
    ],
    finalTitle: "¿Listo para tu día privado de isla?",
    finalText: "Envíanos los detalles de tu grupo y recibe los botes disponibles por WhatsApp.",
    finalCta: "Recibir opciones por WhatsApp",
    kayakLabel: "GUÍA DE VIAJES DESTACADA",
    kayakText: "Azure Horizon Charters aparece en la guía de viajes de Fajardo de KAYAK.",
    kayakCta: "Ver la guía de KAYAK",
    contact: "Villa Marina, Fajardo, Puerto Rico · 787-473-4037",
    legal:
      "Disponibilidad, destino, clima, embarcación, operador y capacidad autorizada se confirman antes del pago. Algunos viajes son realizados por operadores independientes.",
  },
} as const;

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>
          <span aria-hidden="true">✓</span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("en");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("0");
  const [destination, setDestination] = useState("0");
  const [duration, setDuration] = useState("0");
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [bookingBoat, setBookingBoat] = useState<BoatId | null>(null);
  const [bookingTrip, setBookingTrip] = useState("0");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingGuests, setBookingGuests] = useState("1");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("0");
  const [bookingAgreement, setBookingAgreement] = useState(false);
  const [approvedReviews, setApprovedReviews] = useState<PublicReview[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewTripDate, setReviewTripDate] = useState("");
  const [reviewContact, setReviewContact] = useState("");
  const [reviewRating, setReviewRating] = useState("5");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewConsent, setReviewConsent] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const touchStartX = useRef<number | null>(null);
  const t = copy[language];
  const selectedBoat = bookingBoat ? bookingBoats[bookingBoat] : null;
  const selectedTrip = selectedBoat?.trips[Number(bookingTrip)] ?? null;
  const selectedPaymentLink =
    bookingBoat && selectedTrip ? stripePaymentLinks[`${bookingBoat}:${selectedTrip.id}`] : undefined;
  const depositAmount = selectedTrip ? selectedTrip.price * 0.3 : 0;
  const remainingAmount = selectedTrip ? selectedTrip.price - depositAmount : 0;

  useEffect(() => {
    if (activePhoto === null && bookingBoat === null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activePhoto !== null) setActivePhoto(null);
        else setBookingBoat(null);
      }
      if (activePhoto !== null && event.key === "ArrowLeft") {
        setActivePhoto((current) =>
          current === null ? 0 : (current - 1 + galleryImages.length) % galleryImages.length,
        );
      }
      if (activePhoto !== null && event.key === "ArrowRight") {
        setActivePhoto((current) =>
          current === null ? 0 : (current + 1) % galleryImages.length,
        );
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhoto, bookingBoat]);

  useEffect(() => {
    if (activePhoto === null) return;

    [activePhoto, activePhoto - 1, activePhoto + 1].forEach((index) => {
      const normalizedIndex = (index + galleryImages.length) % galleryImages.length;
      const preload = new Image();
      preload.src = galleryImages[normalizedIndex].full;
    });
  }, [activePhoto]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((response) => response.json())
      .then((data: { reviews?: PublicReview[] }) => setApprovedReviews(data.reviews ?? []))
      .catch(() => setApprovedReviews([]));
  }, []);

  const quoteLink = useMemo(() => {
    const message =
      language === "es"
        ? `Hola Azure Horizon, quiero opciones de botes. Fecha: ${date || "por confirmar"}. Personas: ${t.groupOptions[Number(guests)]}. Destino: ${t.destinations[Number(destination)]}. Duración: ${t.durations[Number(duration)]}. Encuentro: Villa Marina, Fajardo.`
        : `Hi Azure Horizon, I would like boat options. Date: ${date || "to be confirmed"}. Guests: ${t.groupOptions[Number(guests)]}. Destination: ${t.destinations[Number(destination)]}. Duration: ${t.durations[Number(duration)]}. Meeting point: Villa Marina, Fajardo.`;
    return `https://wa.me/17874734037?text=${encodeURIComponent(message)}`;
  }, [date, destination, duration, guests, language]);

  const formatPrice = (amount: number) =>
    amount.toLocaleString("en-US", {
      currency: "USD",
      maximumFractionDigits: 0,
      style: "currency",
    });

  const openBooking = (boatId: BoatId) => {
    setBookingBoat(boatId);
    setBookingTrip("0");
    setBookingGuests("1");
    setBookingAgreement(false);
  };

  const handleBookingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedBoat || !selectedTrip || !bookingAgreement) return;

    if (paymentMethod === "0" && selectedPaymentLink) {
      const paymentUrl = new URL(selectedPaymentLink);
      const referenceDate = bookingDate.replaceAll("-", "");
      paymentUrl.searchParams.set("prefilled_email", bookingEmail);
      paymentUrl.searchParams.set(
        "client_reference_id",
        `AH-${bookingBoat}-${selectedTrip.id}-${referenceDate}-${bookingGuests}G`,
      );
      window.location.assign(paymentUrl.toString());
      return;
    }

    const tripLabel = language === "es" ? selectedTrip.labelEs : selectedTrip.labelEn;
    const method = t.paymentOptions[Number(paymentMethod)];
    const message =
      language === "es"
        ? `Hola Azure Horizon, envío una solicitud de reserva.\n\nBote: ${selectedBoat.name}\nViaje: ${tripLabel}\nFecha: ${bookingDate}\nHora preferida: ${bookingTime}\nPersonas: ${bookingGuests}\nPrecio total: ${formatPrice(selectedTrip.price)}\nDepósito 30%: ${formatPrice(depositAmount)}\nBalance: ${formatPrice(remainingAmount)}\nMétodo preferido: ${method}\n\nCliente: ${bookingName}\nCorreo: ${bookingEmail}\nTeléfono: ${bookingPhone}\n\nAcepto la política de cancelación de 48 horas. Entiendo que la reserva queda pendiente de confirmación de disponibilidad, bote y operador.`
        : `Hi Azure Horizon, I am sending a reservation request.\n\nBoat: ${selectedBoat.name}\nTrip: ${tripLabel}\nDate: ${bookingDate}\nPreferred time: ${bookingTime}\nGuests: ${bookingGuests}\nTotal price: ${formatPrice(selectedTrip.price)}\n30% deposit: ${formatPrice(depositAmount)}\nBalance: ${formatPrice(remainingAmount)}\nPreferred method: ${method}\n\nGuest: ${bookingName}\nEmail: ${bookingEmail}\nPhone: ${bookingPhone}\n\nI accept the 48-hour cancellation policy. I understand that availability, vessel and operator must be confirmed.`;

    window.open(`https://wa.me/17874734037?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const showAdjacentPhoto = (direction: number) => {
    setActivePhoto((current) =>
      current === null
        ? 0
        : (current + direction + galleryImages.length) % galleryImages.length,
    );
  };

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReviewStatus("sending");
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/reviews", {
        body: JSON.stringify({
          bookingContact: reviewContact,
          comment: reviewComment,
          consentToPublish: reviewConsent,
          guestName: reviewName,
          language,
          rating: Number(reviewRating),
          tripDate: reviewTripDate,
          website: formData.get("website"),
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      if (!response.ok) throw new Error("Submission failed");

      setReviewStatus("success");
      setReviewName("");
      setReviewTripDate("");
      setReviewContact("");
      setReviewRating("5");
      setReviewComment("");
      setReviewConsent(false);
    } catch {
      setReviewStatus("error");
    }
  };

  return (
    <main>
      <div className="promo-bar">{t.promo}</div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Azure Horizon Charters home">
          <span className="brand-mark">
            <img alt="" aria-hidden="true" src="/images/logo-approved.webp" />
          </span>
          <span>
            <strong>Azure Horizon</strong>
            <small>PRIVATE CHARTERS</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#fleet">{t.nav[0]}</a>
          <a href="#packages">{t.nav[1]}</a>
          <a href="#destinations">{t.nav[2]}</a>
          <a href="#gallery">{t.nav[3]}</a>
          <a href="#faq">{t.nav[4]}</a>
        </nav>
        <button
          className="language-button"
          onClick={() => setLanguage(language === "en" ? "es" : "en")}
          type="button"
        >
          {t.language}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow light">{t.eyebrow}</p>
          <h1>{t.heroTitle}</h1>
          <p className="hero-copy">{t.heroText}</p>
          <div className="hero-actions">
            <a className="button primary" href="#planner">
              {t.quote} <span aria-hidden="true">→</span>
            </a>
            <a className="button glass" href="#fleet">
              {t.fleetCta}
            </a>
          </div>
          <div className="trust-row">
            {t.trust.map((item) => (
              <span key={item}>✓ {item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="planner-wrap" id="planner">
        <div className="planner-intro">
          <span className="mini-icon">↗</span>
          <div>
            <h2>{t.plannerTitle}</h2>
            <p>{t.plannerText}</p>
          </div>
        </div>
        <div className="planner-grid">
          <label>
            {t.date}
            <input
              aria-label={t.date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(event) => setDate(event.target.value)}
              type="date"
              value={date}
            />
          </label>
          <label>
            {t.guests}
            <select value={guests} onChange={(event) => setGuests(event.target.value)}>
              {t.groupOptions.map((option, index) => (
                <option key={option} value={String(index)}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            {t.destination}
            <select value={destination} onChange={(event) => setDestination(event.target.value)}>
              {t.destinations.map((option, index) => (
                <option key={option} value={String(index)}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            {t.duration}
            <select value={duration} onChange={(event) => setDuration(event.target.value)}>
              {t.durations.map((option, index) => (
                <option key={option} value={String(index)}>{option}</option>
              ))}
            </select>
          </label>
          <a className="button planner-button" href={quoteLink} rel="noreferrer" target="_blank">
            {t.quote} <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="planner-foot">
          <strong>{t.from} $650</strong>
          <span>{t.availability}</span>
        </div>
      </section>

      <section className="section fleet-section" id="fleet">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">{t.fleetEyebrow}</p>
            <h2>{t.fleetTitle}</h2>
          </div>
          <p>{t.fleetText}</p>
        </div>

        <div className="boat-grid">
          <article className="boat-card fishing-card">
            <div className="boat-visual mako24-photo">
              <span className="badge">{t.makoTag}</span>
              <span className="boat-number">26&apos;</span>
            </div>
            <div className="boat-body">
              <p className="boat-kicker">MAKO</p>
              <h3>{t.makoName}</h3>
              <p className="boat-spec">{t.makoSub}</p>
              <p className="boat-marina">⌖ {t.makoMarina}</p>
              <p className="boat-fit">{t.makoFit}</p>
              <p className="capacity-badge">{t.smallGroup}</p>
              <div className="boat-photo-preview">
                <span>{t.recentPhotos}</span>
                <div>
                  <button
                    aria-label={`${language === "es" ? "Abrir foto reciente de" : "Open recent photo of"} ${t.makoName}`}
                    onClick={() => setActivePhoto(40)}
                    type="button"
                  >
                    <img alt="" aria-hidden="true" loading="lazy" src={galleryImages[40].thumb} />
                  </button>
                </div>
              </div>
              <div className="price-row">
                <div>
                  <span>{t.fiveFishing}</span>
                  <strong>$850</strong>
                </div>
                <div>
                  <span>{t.sixCharter}</span>
                  <strong>$850</strong>
                </div>
              </div>
              <CheckList items={t.makoIncluded} />
              <p className="deposit-line">{t.depositTag} · $255</p>
              <button className="button dark full-button" onClick={() => openBooking("mako24")} type="button">
                {t.reserve} <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>

          <article className="boat-card">
            <div className="boat-visual hydra28-photo">
              <span className="badge">{t.bestValue}</span>
              <span className="boat-number">28&apos;</span>
            </div>
            <div className="boat-body">
              <p className="boat-kicker">HYDRA-SPORTS</p>
              <h3>{t.hydra28Name}</h3>
              <p className="boat-spec">{t.hydra28Sub}</p>
              <p className="boat-marina">⌖ {t.marina}</p>
              <p className="boat-fit">{t.hydra28Fit}</p>
              <p className="capacity-badge">{t.smallGroup}</p>
              <div className="boat-photo-preview">
                <span>{t.recentPhotos}</span>
                <div>
                  {[29, 30].map((photoIndex) => (
                    <button
                      aria-label={`${language === "es" ? "Abrir foto de" : "Open photo of"} ${t.hydra28Name}`}
                      key={photoIndex}
                      onClick={() => setActivePhoto(photoIndex)}
                      type="button"
                    >
                      <img alt="" aria-hidden="true" loading="lazy" src={galleryImages[photoIndex].thumb} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="price-row">
                <div>
                  <span>{t.fourHours}</span>
                  <strong>$650</strong>
                </div>
                <div>
                  <span>{t.sixHours}</span>
                  <strong>$850</strong>
                </div>
              </div>
              <CheckList items={t.includedShort} />
              <p className="deposit-line">{t.depositTag} · {language === "es" ? "desde " : "from "}$195</p>
              <button className="button dark full-button" onClick={() => openBooking("hydra28")} type="button">
                {t.reserve} <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>

          <article className="boat-card">
            <div className="boat-visual hydra33-photo">
              <span className="badge">{t.moreSpace}</span>
              <span className="boat-number">33&apos;</span>
            </div>
            <div className="boat-body">
              <p className="boat-kicker">HYDRA-SPORTS</p>
              <h3>{t.hydra33Name}</h3>
              <p className="boat-spec">{t.hydra33Sub}</p>
              <p className="boat-marina">⌖ {t.marina}</p>
              <p className="boat-fit">{t.hydra33Fit}</p>
              <p className="capacity-badge">{t.upToTen}</p>
              <div className="boat-photo-preview">
                <span>{t.recentPhotos}</span>
                <div>
                  {[25, 26, 27, 28, 31].map((photoIndex) => (
                    <button
                      aria-label={`${language === "es" ? "Abrir foto de" : "Open photo of"} ${t.hydra33Name}`}
                      key={photoIndex}
                      onClick={() => setActivePhoto(photoIndex)}
                      type="button"
                    >
                      <img alt="" aria-hidden="true" loading="lazy" src={galleryImages[photoIndex].thumb} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="price-row">
                <div>
                  <span>{t.fourHours}</span>
                  <strong>$850</strong>
                </div>
                <div>
                  <span>{t.sixHours}</span>
                  <strong>$1,100</strong>
                </div>
              </div>
              <CheckList items={t.includedShort} />
              <p className="deposit-line">{t.depositTag} · {language === "es" ? "desde " : "from "}$255</p>
              <button className="button primary full-button" onClick={() => openBooking("hydra33")} type="button">
                {t.reserve} <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>

          <article className="boat-card featured">
            <div className="boat-visual grady38-photo">
              <span className="badge">{t.premium}</span>
              <span className="boat-number">38&apos;</span>
            </div>
            <div className="boat-body">
              <p className="boat-kicker">GRADY-WHITE</p>
              <h3>{t.gradyName}</h3>
              <p className="boat-spec">{t.gradySub}</p>
              <p className="boat-marina">⌖ {t.marina}</p>
              <p className="boat-fit">{t.gradyFit}</p>
              <p className="capacity-badge">{t.upToTen}</p>
              <div className="price-row">
                <div>
                  <span>{t.fourHours}</span>
                  <strong>$1,100</strong>
                </div>
                <div>
                  <span>{t.sixHours}</span>
                  <strong>$1,400</strong>
                </div>
              </div>
              <CheckList items={t.includedShort} />
              <p className="deposit-line">{t.depositTag} · {language === "es" ? "desde " : "from "}$330</p>
              <button className="button primary full-button" onClick={() => openBooking("grady38")} type="button">
                {t.reserve} <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>

          <article className="boat-card cruiser-card">
            <div className="boat-visual stamas42-photo">
              <span className="badge">{t.stamasTag}</span>
              <span className="boat-number">42&apos;</span>
            </div>
            <div className="boat-body">
              <p className="boat-kicker">STAMAS</p>
              <h3>{t.stamasName}</h3>
              <p className="boat-spec">{t.stamasSub}</p>
              <p className="boat-marina">⌖ {t.marina}</p>
              <p className="boat-fit">{t.stamasFit}</p>
              <p className="capacity-badge">{t.upToTen}</p>
              <div className="price-row">
                <div>
                  <span>{t.fourHours}</span>
                  <strong>$1,100</strong>
                </div>
                <div>
                  <span>{t.sixHours}</span>
                  <strong>$1,400</strong>
                </div>
              </div>
              <CheckList items={t.includedShort} />
              <p className="deposit-line">{t.depositTag} · {language === "es" ? "desde " : "from "}$330</p>
              <button className="button primary full-button" onClick={() => openBooking("stamas42")} type="button">
                {t.reserve} <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>

        </div>
        <p className="capacity-note">{t.capacityNote}</p>
      </section>

      <section className="image-break" aria-label="Clear water and boats near Fajardo">
        <img alt="Clear turquoise water and boats near Fajardo" src="/images/fleet-water.webp" />
        <div className="image-break-copy">
          <span>{t.clearKicker}</span>
          <strong>{t.clearTitle}</strong>
        </div>
      </section>

      <section className="section packages-section" id="packages">
        <div className="section-heading centered">
          <p className="eyebrow">{t.allInclusive}</p>
          <h2>{t.packageTitle}</h2>
          <p>{t.packageText}</p>
        </div>
        <div className="package-grid">
          <article className="package-card">
            <div className="package-photo drinks-photo">
              <span>4H</span>
            </div>
            <div className="package-body">
              <h3>{t.escape}</h3>
              <p className="package-price">{t.escapeSub}</p>
              <CheckList items={t.escapeList} />
            </div>
          </article>
          <article className="package-card emphasis">
            <div className="package-photo meal-photo">
              <span>6H</span>
            </div>
            <div className="package-body">
              <h3>{t.full}</h3>
              <p className="package-price">{t.fullSub}</p>
              <CheckList items={t.fullList} />
              <small>{t.mealNote}</small>
            </div>
          </article>
        </div>
      </section>

      <section className="booking-info-section" id="booking-info">
        <div className="booking-info-inner">
          <div className="booking-info-heading">
            <p className="eyebrow light">{t.paymentEyebrow}</p>
            <h2>{t.paymentTitle}</h2>
            <p>{t.paymentText}</p>
          </div>
          <div className="booking-policy-grid">
            {t.paymentCards.map(([title, description], index) => (
              <article key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <div className="payment-method-strip">
            <strong>VISA</strong>
            <strong>MC</strong>
            <strong>APPLE PAY</strong>
            <strong>VENMO</strong>
            <strong>ATH MÓVIL</strong>
            <strong>PAYPAL</strong>
          </div>
          <p className="pending-note">ⓘ {t.pendingConfirmation}</p>
        </div>
      </section>

      <section className="section destinations-section" id="destinations">
        <div className="section-heading centered narrow">
          <p className="eyebrow">{t.placesEyebrow}</p>
          <h2>{t.placesTitle}</h2>
        </div>
        <div className="destination-grid">
          {t.places.map(([name, description], index) => (
            <article className={`destination-card destination-${index + 1}`} key={name}>
              <span>0{index + 1}</span>
              <div>
                <h3>{name}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="culebra-showcase">
          <div className="culebra-showcase-heading">
            <div>
              <p className="eyebrow">{t.culebraEyebrow}</p>
              <h3>{t.culebraTitle}</h3>
            </div>
            <p>{t.culebraIntro}</p>
          </div>
          <div className="culebra-route-grid">
            {t.culebraHighlights.map(([label, name, description], index) => {
              const photoIndex = index + 32;
              return (
                <button
                  aria-label={`${language === "es" ? "Abrir foto de" : "Open photo of"} ${name}`}
                  className="culebra-route-card"
                  key={name}
                  onClick={() => setActivePhoto(photoIndex)}
                  type="button"
                >
                  <img alt={name} loading="lazy" src={galleryImages[photoIndex].thumb} />
                  <span>{label}</span>
                  <div>
                    <h4>{name}</h4>
                    <p>{description}</p>
                  </div>
                </button>
              );
            })}
            <button
              aria-label={language === "es" ? "Abrir foto de Cayo Luis Peña" : "Open Cayo Luis Peña photo"}
              className="culebra-route-card"
              onClick={() => setActivePhoto(39)}
              type="button"
            >
              <img alt={t.luisPenaTitle} decoding="async" loading="lazy" src="/images/gallery/40-thumb.webp" />
              <span>{t.luisPenaPhoto}</span>
              <div>
                <h4>{t.luisPenaTitle}</h4>
                <p>{t.luisPenaText}</p>
              </div>
            </button>
          </div>
          {/* Luis Peña now uses the same card size as every other Culebra stop. */}
          {false && <article className="luis-pena-note">
            <button
              aria-label={language === "es" ? "Abrir foto de Cayo Luis Peña" : "Open Cayo Luis Peña photo"}
              className="luis-pena-photo"
              onClick={() => setActivePhoto(39)}
              type="button"
            >
              <img alt={t.luisPenaTitle} decoding="async" loading="lazy" src="/images/gallery/40-thumb.webp" />
            </button>
            <div>
              <span>{t.luisPenaPhoto}</span>
              <h4>{t.luisPenaTitle}</h4>
              <p>{t.luisPenaText}</p>
            </div>
          </article>}
        </div>
        <div className="distance-guide">
          <div className="distance-guide-heading">
            <p className="eyebrow">{t.distanceEyebrow}</p>
            <h3>{t.distanceTitle}</h3>
          </div>
          <div className="distance-list">
            {t.distanceGuide.map(([name, time, description]) => (
              <article key={name}>
                <div>
                  <h4>{name}</h4>
                  <p>{description}</p>
                </div>
                <strong>{time}</strong>
              </article>
            ))}
          </div>
          <p className="distance-note">ⓘ {t.distanceNote}</p>
        </div>
      </section>

      <section className="gallery-section" id="gallery">
        <div className="gallery-heading">
          <div>
            <p className="eyebrow light">{t.galleryEyebrow}</p>
            <h2>{t.galleryTitle}</h2>
          </div>
          <div>
            <p>{t.galleryText}</p>
            <span>{t.galleryCount}</span>
          </div>
        </div>
        <div className={`gallery-grid${showAllGallery ? " expanded" : ""}`}>
          {galleryImages.slice(0, showAllGallery ? galleryImages.length : 9).map((image, index) => (
            <button
              aria-label={language === "es" ? `Abrir foto ${index + 1}` : `Open photo ${index + 1}`}
              className="gallery-tile"
              key={image.full}
              onClick={() => setActivePhoto(index)}
              type="button"
            >
              <img
                alt={language === "es" ? `Viaje real de Azure Horizon ${index + 1}` : `Real Azure Horizon trip ${index + 1}`}
                decoding="async"
                loading="lazy"
                src={image.thumb}
              />
              {!showAllGallery && index === 8 && <span>+{galleryImages.length - 9}</span>}
            </button>
          ))}
        </div>
        <button
          className="button gallery-toggle"
          onClick={() => setShowAllGallery((current) => !current)}
          type="button"
        >
          {showAllGallery ? t.galleryShowLess : t.galleryOpenAll}
        </button>
      </section>

      <section className="section reviews-section" id="reviews">
        <div className="section-heading centered narrow">
          <p className="eyebrow">{t.reviewsEyebrow}</p>
          <h2>{t.reviewsTitle}</h2>
          <p>{t.reviewsNote}</p>
        </div>
        <div className="reviews-grid">
          {t.reviews.map(([quote, guest]) => (
            <blockquote key={guest}>
              <span aria-hidden="true">“</span>
              <p>{quote}</p>
              <cite>— {guest}</cite>
            </blockquote>
          ))}
          {approvedReviews.map((review) => (
            <blockquote key={`approved-${review.id}`}>
              <span aria-hidden="true">“</span>
              <p>{review.comment}</p>
              <cite>— {review.guestName} · {"★".repeat(review.rating)} · {language === "es" ? "Pasajero verificado" : "Verified guest"}</cite>
            </blockquote>
          ))}
        </div>
        <div className="feedback-panel">
          <div className="feedback-copy">
            <p className="eyebrow">{language === "es" ? "COMENTARIOS VERIFICADOS" : "VERIFIED FEEDBACK"}</p>
            <h3>{t.feedbackTitle}</h3>
            <p>{t.feedbackText}</p>
          </div>
          <form className="feedback-form" onSubmit={handleReviewSubmit}>
            <label>
              {t.feedbackName}
              <input maxLength={80} onChange={(event) => setReviewName(event.target.value)} required value={reviewName} />
            </label>
            <label>
              {t.feedbackTripDate}
              <input max={new Date().toISOString().slice(0, 10)} onChange={(event) => setReviewTripDate(event.target.value)} required type="date" value={reviewTripDate} />
            </label>
            <label className="wide-field">
              {t.feedbackContact}
              <input autoComplete="email" maxLength={140} onChange={(event) => setReviewContact(event.target.value)} required value={reviewContact} />
            </label>
            <label>
              {t.feedbackRating}
              <select onChange={(event) => setReviewRating(event.target.value)} value={reviewRating}>
                <option value="5">5 — Excelente</option>
                <option value="4">4 — Muy bueno</option>
                <option value="3">3 — Bueno</option>
                <option value="2">2 — Regular</option>
                <option value="1">1 — Malo</option>
              </select>
            </label>
            <label className="wide-field">
              {t.feedbackComment}
              <textarea maxLength={900} minLength={12} onChange={(event) => setReviewComment(event.target.value)} required rows={5} value={reviewComment} />
            </label>
            <label className="feedback-honeypot" aria-hidden="true">
              Website
              <input autoComplete="off" name="website" tabIndex={-1} />
            </label>
            <label className="feedback-consent wide-field">
              <input checked={reviewConsent} onChange={(event) => setReviewConsent(event.target.checked)} required type="checkbox" />
              <span>{t.feedbackConsent}</span>
            </label>
            <div className="feedback-submit wide-field">
              <button className="button primary" disabled={reviewStatus === "sending"} type="submit">
                {reviewStatus === "sending" ? t.feedbackSending : t.feedbackSubmit}
              </button>
              {reviewStatus === "success" && <p className="feedback-success">{t.feedbackSuccess}</p>}
              {reviewStatus === "error" && <p className="feedback-error">{t.feedbackError}</p>}
            </div>
          </form>
        </div>
      </section>

      <section className="experience-section">
        <div className="experience-image" />
        <div className="experience-copy">
          <p className="eyebrow light">{t.experienceEyebrow}</p>
          <h2>{t.experienceTitle}</h2>
          <p>{t.experienceText}</p>
          <div className="reason-grid">
            {t.reasons.map(([title, description]) => (
              <div key={title}>
                <span aria-hidden="true">✓</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section steps-section">
        <div className="section-heading centered narrow">
          <h2>{t.howTitle}</h2>
        </div>
        <div className="steps-grid">
          {t.steps.map(([number, title, description]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="section-heading centered narrow">
          <h2>{t.faqTitle}</h2>
        </div>
        <div className="faq-list">
          {t.faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}<span aria-hidden="true">+</span></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <img alt="Azure Horizon Charters Puerto Rico" src="/images/logo-approved.webp" />
        <div>
          <h2>{t.finalTitle}</h2>
          <p>{t.finalText}</p>
        </div>
        <a className="button primary" href={quoteLink} target="_blank" rel="noreferrer">
          {t.finalCta} <span aria-hidden="true">→</span>
        </a>
      </section>

      <section className="kayak-feature" aria-label="KAYAK Fajardo Travel Guide">
        <div className="kayak-wordmark">KAYAK</div>
        <div>
          <span>{t.kayakLabel}</span>
          <p>{t.kayakText}</p>
        </div>
        <a
          href="https://www.kayak.es/Municipio-de-Fajardo.24347.guide"
          rel="noreferrer"
          target="_blank"
        >
          {t.kayakCta} <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer>
        <div>
          <strong>Azure Horizon Charters</strong>
          <span>{t.contact}</span>
        </div>
        <p>{t.legal}</p>
        <small>© 2026 Azure Horizon Charters. All rights reserved.</small>
      </footer>

      {bookingBoat !== null && selectedBoat && selectedTrip && (
        <div
          aria-label={t.bookingTitle}
          aria-modal="true"
          className="booking-overlay"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setBookingBoat(null);
          }}
          role="dialog"
        >
          <div className="booking-modal">
            <button
              aria-label={language === "es" ? "Cerrar reservación" : "Close reservation"}
              className="booking-close"
              onClick={() => setBookingBoat(null)}
              type="button"
            >
              ×
            </button>
            <div className="booking-boat-panel">
              <img alt={selectedBoat.name} src={selectedBoat.image} />
              <div>
                <p className="eyebrow light">{t.depositTag}</p>
                <h2>{selectedBoat.name}</h2>
                <p>{t.bookingIntro}</p>
                <span>{language === "es" ? "Hasta" : "Up to"} {selectedBoat.maxGuests} {language === "es" ? "personas" : "guests"}</span>
              </div>
            </div>
            <form className="booking-form" onSubmit={handleBookingSubmit}>
              <div className="booking-form-heading">
                <p className="eyebrow">{language === "es" ? "DETALLES DEL VIAJE" : "TRIP DETAILS"}</p>
                <h2>{t.bookingTitle}</h2>
              </div>
              <div className="booking-fields">
                <label className="wide-field">
                  {t.selectTrip}
                  <select onChange={(event) => setBookingTrip(event.target.value)} value={bookingTrip}>
                    {selectedBoat.trips.map((trip, index) => (
                      <option key={trip.id} value={String(index)}>
                        {language === "es" ? trip.labelEs : trip.labelEn} · {formatPrice(trip.price)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {t.bookingDate}
                  <input
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(event) => setBookingDate(event.target.value)}
                    required
                    type="date"
                    value={bookingDate}
                  />
                </label>
                <label>
                  {t.bookingTime}
                  <input onChange={(event) => setBookingTime(event.target.value)} required type="time" value={bookingTime} />
                </label>
                <label>
                  {t.bookingGuests}
                  <input
                    max={selectedBoat.maxGuests}
                    min="1"
                    onChange={(event) => setBookingGuests(event.target.value)}
                    required
                    type="number"
                    value={bookingGuests}
                  />
                </label>
                <label>
                  {t.paymentMethod}
                  <select onChange={(event) => setPaymentMethod(event.target.value)} value={paymentMethod}>
                    {t.paymentOptions.map((option, index) => (
                      <option key={option} value={String(index)}>{option}</option>
                    ))}
                  </select>
                </label>
                <label className="wide-field">
                  {t.fullName}
                  <input onChange={(event) => setBookingName(event.target.value)} required type="text" value={bookingName} />
                </label>
                <label>
                  {t.email}
                  <input onChange={(event) => setBookingEmail(event.target.value)} required type="email" value={bookingEmail} />
                </label>
                <label>
                  {t.phone}
                  <input onChange={(event) => setBookingPhone(event.target.value)} required type="tel" value={bookingPhone} />
                </label>
              </div>
              <div className="booking-summary">
                <div>
                  <span>{t.totalPrice}</span>
                  <strong>{formatPrice(selectedTrip.price)}</strong>
                </div>
                <div className="deposit-summary">
                  <span>{t.depositDue}</span>
                  <strong>{formatPrice(depositAmount)}</strong>
                </div>
                <div>
                  <span>{t.remainingBalance}</span>
                  <strong>{formatPrice(remainingAmount)}</strong>
                </div>
              </div>
              <label className="booking-checkbox">
                <input
                  checked={bookingAgreement}
                  onChange={(event) => setBookingAgreement(event.target.checked)}
                  required
                  type="checkbox"
                />
                <span>{t.bookingAgreement}</span>
              </label>
              <button className="button primary booking-submit" type="submit">
                {paymentMethod === "0"
                  ? language === "es"
                    ? "Pagar depósito 30% seguro"
                    : "Pay secure 30% deposit"
                  : t.sendReservation}{" "}
                <span aria-hidden="true">→</span>
              </button>
              <p className="no-charge-note">
                🔒 {paymentMethod === "0"
                  ? language === "es"
                    ? "Continuarás al pago seguro de Stripe. La reservación queda sujeta a confirmación final de disponibilidad, embarcación y operador."
                    : "You will continue to secure Stripe checkout. The reservation remains subject to final vessel, operator and availability confirmation."
                  : t.noChargeYet}
              </p>
            </form>
          </div>
        </div>
      )}

      {activePhoto !== null && (
        <div
          aria-label={language === "es" ? "Galería de fotos" : "Photo gallery"}
          aria-modal="true"
          className="gallery-lightbox"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setActivePhoto(null);
          }}
          role="dialog"
        >
          <button
            aria-label={language === "es" ? "Cerrar galería" : "Close gallery"}
            className="lightbox-close"
            onClick={() => setActivePhoto(null)}
            type="button"
          >
            ×
          </button>
          <button
            aria-label={language === "es" ? "Foto anterior" : "Previous photo"}
            className="lightbox-arrow lightbox-previous"
            onClick={() => showAdjacentPhoto(-1)}
            type="button"
          >
            ‹
          </button>
          <figure
            onTouchEnd={(event) => {
              if (touchStartX.current === null) return;
              const distance = event.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(distance) > 45) showAdjacentPhoto(distance > 0 ? -1 : 1);
              touchStartX.current = null;
            }}
            onTouchStart={(event) => {
              touchStartX.current = event.changedTouches[0].clientX;
            }}
          >
            <img
              alt={
                language === "es"
                  ? `Viaje real de Azure Horizon ${activePhoto + 1}`
                  : `Real Azure Horizon trip ${activePhoto + 1}`
              }
              decoding="async"
              src={galleryImages[activePhoto].full}
            />
            <figcaption>{activePhoto + 1} / {galleryImages.length}</figcaption>
          </figure>
          <button
            aria-label={language === "es" ? "Próxima foto" : "Next photo"}
            className="lightbox-arrow lightbox-next"
            onClick={() => showAdjacentPhoto(1)}
            type="button"
          >
            ›
          </button>
        </div>
      )}

      <a className="floating-whatsapp" href={quoteLink} target="_blank" rel="noreferrer" aria-label="WhatsApp Azure Horizon">
        <span>WA</span>
        {language === "es" ? "Cotizar" : "Get a quote"}
      </a>
    </main>
  );
}
