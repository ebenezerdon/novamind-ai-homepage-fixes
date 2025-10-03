/* scripts/data.js
   Responsibilities: structured static data used by the UI (features, testimonials)
   Attaches data to window.App.Data
*/

(function(window){
  window.App = window.App || {};
  window.App.Data = window.App.Data || {};

  window.App.Data.features = [
    {
      id: 'prototype-fast',
      title: 'Prototype in hours',
      desc: 'Move from idea to working prototype quickly with model templates and a visual orchestration studio.',
      icon: '⚡'
    },
    {
      id: 'explainable',
      title: 'Explainable outputs',
      desc: 'We log reasoning paths and provide tools to surface why the model produced results.',
      icon: '🔍'
    },
    {
      id: 'safe-by-default',
      title: 'Safety first',
      desc: 'Built-in filters, rate limits, and human-in-the-loop review to reduce risk in production.',
      icon: '🛡️'
    }
  ];

  window.App.Data.testimonials = [
    { name: 'Priya K.', role: 'Product Lead, Atlas', quote: 'NovaMind reduced our experimentation cycle from weeks to days.', company: 'Atlas' },
    { name: 'Marco B.', role: 'CTO, Lumen', quote: 'Production-ready models with clear docs and great tooling.', company: 'Lumen' },
    { name: 'Jen T.', role: 'PM, Freya', quote: 'The studio helped our team prototype a conversational assistant in one sprint.', company: 'Freya' }
  ];

  // Expose pricing plans/data if needed in future
  window.App.Data.pricing = [
    { id: 'starter', title: 'Starter', price: 'Free' },
    { id: 'team', title: 'Team', price: '$49/mo' },
    { id: 'enterprise', title: 'Enterprise', price: 'Custom' }
  ];

})(window);
