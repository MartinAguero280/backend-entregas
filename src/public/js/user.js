document.addEventListener('DOMContentLoaded', () => {
    const deleteUserButton = document.querySelectorAll('.deleteUserButton');

    deleteUserButton.forEach(button => {
        button.addEventListener('click', (event) => {
            const userId = event.target.dataset.userId;
            const userRole = event.target.dataset.userRole
            const userCart = event.target.dataset.userCart

            fetch(`/api/users/${userId}?userRole=${userRole}&userCart=${userCart}`, {
                    method: 'DELETE'
                });
                location.reload()
        });
    });

    const roleDropdownButton = document.querySelectorAll('.userdropDownButton');

    roleDropdownButton.forEach(button => {
        button.addEventListener('click', (event) => {
            const newRoleUser = event.target.dataset.newRoleUser;
            const userId = event.target.dataset.userId;
            const userRole = event.target.dataset.userRole

            fetch(`/api/users/${userId}/${newRoleUser}?userRole=${userRole}`, {
                    method: 'PUT'
                });
                location.reload()
        });
    });
});