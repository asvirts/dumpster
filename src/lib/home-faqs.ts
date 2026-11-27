import { BRAND } from './constants';

/** Home page FAQ, rendered on the page and as FAQPage JSON-LD. */
export const faqs = [
  {
    question: 'How much does a dumpster rental cost?',
    answer:
      `Most residential roll-off dumpster rentals run $325–$700 depending on container size, your city, included tonnage, and dump fees. Where an operator publishes its prices, ${BRAND.name} shows that range on its listing. Either way, you should always confirm an all-in quote that includes delivery, rental days, tonnage, and overage before booking.`,
  },
  {
    question: 'What size dumpster do I need?',
    answer:
      'A 10-yard dumpster fits small cleanouts and bathroom remodels, a 20-yard handles roof tear-offs and whole-home cleanouts, and 30–40 yard containers suit major renovations and new construction. Our size guide matches common projects to each container size.',
  },
  {
    question: 'Do I need a permit for a dumpster?',
    answer:
      `Usually only for street placement. Most cities require a right-of-way permit if the container sits on a public street, while driveway placement typically needs no permit. Each city page on ${BRAND.name} includes local permit notes so you know before you book.`,
  },
  {
    question: 'What can I put in a rented dumpster?',
    answer:
      'Most construction debris, household junk, yard waste, roofing, and concrete are accepted — but tires, batteries, paint, and hazardous materials are almost always prohibited. Accepted materials are listed on every operator profile.',
  },
  {
    question: 'How fast can I get a dumpster delivered?',
    answer:
      'Many verified operators offer same-day or next-day delivery when inventory allows. Use the same-day filter on search to see only operators who list that capability in your area.',
  },
  {
    question: 'Why book through a verified local operator instead of a broker?',
    answer:
      `Brokers take your order and sub it out — often with markup and murky accountability. ${BRAND.name} hides brokers by default and shows a last-verified date on every listing, so you book direct with the company that actually drops the container.`,
  },
];
