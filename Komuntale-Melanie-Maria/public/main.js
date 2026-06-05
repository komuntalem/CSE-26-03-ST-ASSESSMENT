document.addEventListener('DOMContentLoaded', () => {

  // ── Thumbnail preview ──
  const thumbInput = document.getElementById('thumbnail');
  const thumbPreview = document.getElementById('thumb-preview');
  const thumbPlaceholder = document.querySelector('.thumb-placeholder-content');

  if (thumbInput) {
    thumbInput.addEventListener('change', () => {
      const file = thumbInput.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          thumbPreview.src = e.target.result;
          thumbPreview.style.display = 'block';
          if (thumbPlaceholder) thumbPlaceholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ── Video file label update ──
  const videoInput = document.getElementById('videoFile');
  const videoBox = document.querySelector('.upload-video-box');

  if (videoInput && videoBox) {
    videoInput.addEventListener('change', () => {
      const file = videoInput.files[0];
      if (file) {
        const p = videoBox.querySelector('p');
        if (p) p.textContent = file.name;
        videoBox.style.borderColor = 'var(--red)';
        videoBox.style.background = '#fdf0f0';
      }
    });
  }

  // ── Client-side validation ──
  const form = document.getElementById('upload-form');
  if (form) {
    // Clear error on input
    ['title', 'quality', 'publishDate'].forEach(name => {
      const el = document.getElementById(name);
      if (!el) return;
      el.addEventListener('input', () => clearError(el));
      el.addEventListener('change', () => clearError(el));
    });

    form.addEventListener('submit', (e) => {
      let valid = true;

      const title = document.getElementById('title');
      const quality = document.getElementById('quality');
      const publishDate = document.getElementById('publishDate');
      const videoFile = document.getElementById('videoFile');

      if (!title.value.trim()) {
        showError(title, 'Required field');
        valid = false;
      }

      if (!quality.value) {
        showError(quality, 'Required field');
        valid = false;
      }

      if (!publishDate.value) {
        showError(publishDate, 'Required field');
        valid = false;
      }

      if (!videoFile.files.length) {
        const box = document.querySelector('.upload-video-box');
        let err = box.querySelector('.field-error');
        if (!err) {
          err = document.createElement('span');
          err.className = 'field-error';
          box.appendChild(err);
        }
        err.textContent = 'Required field';
        valid = false;
      }

      if (!valid) e.preventDefault();
    });
  }

  function showError(el, msg) {
    el.classList.add('error');
    let err = el.parentElement.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      el.parentElement.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearError(el) {
    el.classList.remove('error');
    const err = el.parentElement.querySelector('.field-error');
    if (err) err.textContent = '';
  }
});
