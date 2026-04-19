import Swal from 'sweetalert2'

const AlertService = {
    success(message, title = 'Success') {
        return Swal.fire({
            icon: 'success',
            title,
            text: message
        })
    },

    error(message, title = 'Error') {
        return Swal.fire({
            icon: 'error',
            title,
            text: message
        })
    },

    confirm(message, title = 'Are you sure?') {
        return Swal.fire({
            icon: 'question',
            title,
            text: message,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',       // text color
            confirmButtonColor: '#22c55e', // button color (green)
            cancelButtonColor: '#ef4444'
        })
    },

    toast(message, icon = 'success') {
        return Swal.fire({
            toast: true,
            position: 'top-end',
            icon,
            title: message,
            showConfirmButton: false,
            timer: 3000
        })
    }
}

export default AlertService