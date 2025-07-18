document.querySelectorAll('#sidebar a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.dataset.target;

        // Remove active class from all links
        document.querySelectorAll('#sidebar a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // Hide all sections
        document.querySelectorAll('section').forEach(sec => sec.classList.add('d-none'));

        // Show needed section
        document.getElementById(targetId).classList.remove('d-none');
    });
});
