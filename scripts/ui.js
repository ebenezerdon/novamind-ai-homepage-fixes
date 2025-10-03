/* scripts/ui.js
   Responsibilities: define window.App namespace, render UI fragments, wire events, and provide App.init and App.render.
   Uses jQuery for DOM manipulation. Robust error handling and comments included.
*/

(function(window, $){
  // Ensure the single global namespace exists per project contract
  window.App = window.App || {};

  // Basic UI state stored in memory, persisted where useful
  var state = {
    testimonialsIndex: 0,
    waitlist: []
  };

  // Render helpers
  function renderFeatures(){
    var features = (window.App.Data && window.App.Data.features) || [];
    var $container = $('#features').find('> div.grid, > .grid').first();
    if (!$container || !$container.length) {
      $container = $('#features').find('.mt-6.grid').first();
    }
    // Fallback: if selector didn't find, create container
    if (!$container || !$container.length) {
      $container = $('<div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6"></div>');
      $('#features').append($container);
    }

    $container.empty();
    features.forEach(function(f, idx){
      var $card = $(`
        <div class="card" role="article" aria-labelledby="feature-${f.id}">
          <div class="text-indigo-600 text-2xl">${f.icon}</div>
          <h4 id="feature-${f.id}" class="mt-3 font-semibold">${f.title}</h4>
          <p class="mt-1 text-sm text-gray-600">${f.desc}</p>
        </div>
      `);
      $container.append($card);
    });
  }

  function renderTestimonial(index){
    var testimonials = (window.App.Data && window.App.Data.testimonials) || [];
    if (!testimonials.length) return;
    index = Math.max(0, Math.min(index, testimonials.length - 1));
    state.testimonialsIndex = index;
    var t = testimonials[index];

    var $card = $('#testimonial-card');
    var html = `
      <blockquote class="testimony">
        <p class="text-gray-800">"${t.quote}"</p>
        <footer class="mt-4 text-sm text-gray-600">— ${t.name}, <span class="font-medium">${t.role}</span> at ${t.company}</footer>
      </blockquote>
    `;

    // Gentle animation
    $card.removeClass('testimonial-enter');
    $card.html(html);
    // Force reflow for animation
    void $card[0].offsetWidth;
    $card.addClass('testimonial-enter');

    // Indicators
    var $ind = $('#test-indicators');
    $ind.empty();
    testimonials.forEach(function(_, i){
      var $dot = $(`<button class="w-2 h-2 rounded-full" aria-label="Testimonial ${i+1}"></button>`);
      $dot.css('background-color', i === index ? '#6366f1' : '#e5e7eb');
      $ind.append($dot);
    });
  }

  function openModal(){
    var $overlay = $('#modal-overlay');
    $overlay.show().attr('aria-hidden', 'false');
    // trap focus to first form field
    window.AppHelpers && window.AppHelpers.focusFirst($overlay);
  }
  function closeModal(){
    var $overlay = $('#modal-overlay');
    $overlay.hide().attr('aria-hidden', 'true');
  }

  function showFeedback(message, type){
    var $fb = $('#form-feedback');
    var color = type === 'error' ? 'text-red-600' : 'text-green-600';
    $fb.removeClass('text-red-600 text-green-600').addClass(color).text(message);
    setTimeout(function(){ $fb.fadeOut(300, function(){ $fb.text('').show().removeClass(color); }); }, 3500);
  }

  // Waitlist handling
  function loadWaitlist(){
    var list = [];
    try {
      list = window.App.Storage && typeof window.App.Storage.loadWaitlist === 'function' ? window.App.Storage.loadWaitlist() : [];
    } catch (e){ console.error('Failed to load waitlist', e); }
    state.waitlist = Array.isArray(list) ? list : [];
  }

  function persistWaitlist(){
    try {
      if (window.App.Storage && typeof window.App.Storage.saveWaitlist === 'function') {
        window.App.Storage.saveWaitlist(state.waitlist);
      }
    } catch (e){ console.error('Failed to persist waitlist', e); }
  }

  // Event bindings
  function bindEvents(){
    // mobile nav toggle
    $('#mobile-nav-toggle').on('click', function(){
      var expanded = $(this).attr('aria-expanded') === 'true';
      $(this).attr('aria-expanded', String(!expanded));
      var $menu = $('#mobile-menu');
      if ($menu.is(':visible')) { $menu.attr('hidden', true); $menu.hide(); }
      else { $menu.removeAttr('hidden').show(); }
    });

    // Waitlist form submit
    $('#waitlist-form').on('submit', function(e){
      e.preventDefault();
      var email = $('#email').val();
      if (!window.AppHelpers.isValidEmail(email)) {
        showFeedback('Please enter a valid email address.', 'error');
        $('#email').attr('aria-invalid', 'true').focus();
        return;
      }
      $('#email').attr('aria-invalid', 'false');
      // add to list if not duplicate
      var exists = state.waitlist.indexOf(email.trim().toLowerCase()) !== -1;
      if (exists) {
        showFeedback('You are already on the waitlist. Thank you!', 'success');
        return;
      }
      state.waitlist.push(email.trim().toLowerCase());
      persistWaitlist();
      showFeedback('Thanks! We saved your spot on the waitlist.', 'success');
      $('#email').val('');
    });

    // Mobile waitlist open
    $('#mobile-waitlist').on('click', function(){ $('#open-waitlist').trigger('click'); $('#mobile-menu').hide(); });

    // Open modal demo
    $('#demo-btn, #open-waitlist').on('click', function(){ openModal(); });
    // Also wire mobile variant
    $('#mobile-waitlist').on('click', function(){ openModal(); });

    $('#modal-close').on('click', function(){ closeModal(); });
    $('#modal-overlay').on('click', function(e){ if (e.target === this) closeModal(); });

    // Demo form submission
    $('#demo-form').on('submit', function(e){
      e.preventDefault();
      var email = $('#demo-email').val();
      if (!window.AppHelpers.isValidEmail(email)) {
        alert('Please provide a valid email for demo requests.');
        return;
      }
      // persist into waitlist as part of demo capture
      var lower = email.trim().toLowerCase();
      if (state.waitlist.indexOf(lower) === -1) state.waitlist.push(lower);
      persistWaitlist();
      closeModal();
      alert('Thanks! We will contact you soon.');
    });

    // testimonials navigation
    $('#next-test').on('click', function(){
      var len = (window.App.Data && window.App.Data.testimonials || []).length;
      if (!len) return;
      var next = (state.testimonialsIndex + 1) % len;
      renderTestimonial(next);
    });
    $('#prev-test').on('click', function(){
      var len = (window.App.Data && window.App.Data.testimonials || []).length;
      if (!len) return;
      var next = (state.testimonialsIndex - 1 + len) % len;
      renderTestimonial(next);
    });

    // Pricing CTA buttons
    $('button[data-plan]').on('click', function(){
      var plan = $(this).attr('data-plan');
      // Quick lightweight capture and show modal
      $('#demo-message').val('Interested in plan: ' + plan);
      openModal();
    });

    // keyboard accessibility for testimonials
    $('#testimonial-card').on('keydown', function(e){
      if (e.key === 'ArrowRight') { $('#next-test').trigger('click'); }
      if (e.key === 'ArrowLeft') { $('#prev-test').trigger('click'); }
    });
  }

  // Public API per contract
  window.App.init = function(){
    try {
      // Load persisted waitlist
      loadWaitlist();

      // Render initial visuals
      renderFeatures();
      renderTestimonial(0);

      // Accessibility: ensure form elements have labels and focus states
      $('input,button,textarea').attr('tabindex', function(i, t){ return t ? t : 0; });

      // Bind events
      bindEvents();

      // Expose internal state for debugging in dev mode
      if (window.location.search.indexOf('debug=1') !== -1) {
        window.App._state = state;
      }
    } catch (e) {
      console.error('App.init failed', e);
    }
  };

  window.App.render = function(){
    try {
      // Final pass: hydrate any necessary elements and show micro-interactions
      // Show subtle entrance animations for hero and first feature
      $('.card').slice(0,3).each(function(i, el){
        $(el).css({opacity:0, transform: 'translateY(8px)'}).animate({opacity:1, top:0, transform: 'translateY(0)'}, 400 + i*100);
      });

      // Provide initial focus to email for quick capture
      $('#email').attr('placeholder', 'you@company.com').focus();
    } catch (e){ console.error('App.render failed', e); }
  };

})(window, jQuery);
