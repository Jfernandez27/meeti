import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    const formsDelete = document.querySelectorAll('.eliminar-comentario');

    if (formsDelete.length > 0) {
        formsDelete.forEach((form) => {
            form.addEventListener('submit', deleteComment);
        });
    }
});

function deleteComment(e) {
    e.preventDefault();

    Swal.fire({
        title: 'Delete comment',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
        if (result.isConfirmed) {
            const commentId = this.children[0].value;

            const data = {
                commentId,
            };

            axios
                .post(this.action, data)
                .then((response) => {
                    Swal.fire({
                        title: 'Deleted!',
                        text: response.data,
                        icon: 'success',
                    });
                    // Delete from DOM
                    this.parentElement.parentElement.remove();
                })
                .catch((error) => {
                    Swal.fire({
                        title: 'Error!',
                        text: error.response.data,
                        icon: 'error',
                    });
                });
        }
    });
}
