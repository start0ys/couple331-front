document.getElementById('toggle-sidebar').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main');
    
    sidebar.classList.toggle('close-sidebar');
    main.classList.toggle('close-main');
});