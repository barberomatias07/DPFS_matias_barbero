window.addEventListener('DOMContentLoaded', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const extensionesPermitidas = ['jpg', 'jpeg', 'png', 'gif'];

    // Muestra u oculta el mensaje debajo del input y pinta el borde
    const mostrarError = (input, mensaje) => {
        if (!input) return;
        const small = input.parentElement.querySelector('.error-msg');
        if (small) {
            small.textContent = mensaje;
        }
        if (input.type !== 'file') {
            input.style.borderColor = mensaje ? '#ff4d4d' : '#444';
        }
    };

    // Valida extensiones de imagen (si el usuario seleccionó un archivo)
    const validarImagen = (fileInput) => {
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            return '';
        }
        const nombre = fileInput.files[0].name;
        const ext = nombre.split('.').pop().toLowerCase();
        if (!extensionesPermitidas.includes(ext)) {
            return 'Formato inválido. Solo se permiten JPG, JPEG, PNG o GIF';
        }
        return '';
    };

    // Conecta validación en tiempo real (al salir del campo y al corregir)
    const activarFeedbackEnVivo = (input, validador) => {
        if (!input) return;
        const evento = input.type === 'file' ? 'change' : 'blur';
        input.addEventListener(evento, () => {
            mostrarError(input, validador());
        });

        if (input.type !== 'file') {
            input.addEventListener('input', () => {
                const small = input.parentElement.querySelector('.error-msg');
                if (small && small.textContent !== '') {
                    mostrarError(input, validador());
                }
            });
        }
    };

    // ==========================================
    // 1. VALIDACIÓN FORMULARIO DE REGISTRO
    // ==========================================
    const formRegister = document.getElementById('formRegister');
    if (formRegister) {
        const fullName = formRegister.querySelector('input[name="fullName"]');
        const email = formRegister.querySelector('input[name="email"]');
        const password = formRegister.querySelector('input[name="password"]');
        const avatar = formRegister.querySelector('input[name="avatar"]');

        const checkFullName = () => {
            const val = fullName.value.trim();
            if (!val) return 'Tenés que ingresar tu nombre completo';
            if (val.length < 2) return 'El nombre debe tener al menos 2 caracteres';
            return '';
        };

        const checkEmail = () => {
            const val = email.value.trim();
            if (!val) return 'Tenés que ingresar un correo electrónico';
            if (!emailRegex.test(val)) return 'Ingresá un formato de correo válido';
            return '';
        };

        const checkPassword = () => {
            const val = password.value;
            if (!val) return 'Tenés que ingresar una contraseña';
            if (val.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
            return '';
        };

        const checkAvatar = () => validarImagen(avatar);

        activarFeedbackEnVivo(fullName, checkFullName);
        activarFeedbackEnVivo(email, checkEmail);
        activarFeedbackEnVivo(password, checkPassword);
        activarFeedbackEnVivo(avatar, checkAvatar);

        formRegister.addEventListener('submit', (e) => {
            const errName = checkFullName();
            const errEmail = checkEmail();
            const errPass = checkPassword();
            const errAvatar = checkAvatar();

            mostrarError(fullName, errName);
            mostrarError(email, errEmail);
            mostrarError(password, errPass);
            mostrarError(avatar, errAvatar);

            if (errName || errEmail || errPass || errAvatar) {
                e.preventDefault();
            }
        });
    }

    // ==========================================
    // 2. VALIDACIÓN FORMULARIO DE LOGIN
    // ==========================================
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        const email = formLogin.querySelector('input[name="email"]');
        const password = formLogin.querySelector('input[name="password"]');

        const checkEmail = () => {
            const val = email.value.trim();
            if (!val) return 'Tenés que ingresar tu correo electrónico';
            if (!emailRegex.test(val)) return 'Ingresá un formato de correo válido';
            return '';
        };

        const checkPassword = () => {
            if (!password.value) return 'Tenés que ingresar tu contraseña';
            return '';
        };

        activarFeedbackEnVivo(email, checkEmail);
        activarFeedbackEnVivo(password, checkPassword);

        formLogin.addEventListener('submit', (e) => {
            const errEmail = checkEmail();
            const errPass = checkPassword();

            mostrarError(email, errEmail);
            mostrarError(password, errPass);

            if (errEmail || errPass) {
                e.preventDefault();
            }
        });
    }

    // ==========================================
    // 3. VALIDACIÓN FORMULARIOS DE PRODUCTOS (CREAR Y EDITAR)
    // ==========================================
    const formsProducto = [
        document.getElementById('formProductAdd'),
        document.getElementById('formProductEdit')
    ].filter(Boolean);

    formsProducto.forEach((formProd) => {
        const name = formProd.querySelector('input[name="name"]');
        const price = formProd.querySelector('input[name="price"]');
        const image = formProd.querySelector('input[name="image"]');
        const description = formProd.querySelector('textarea[name="description"]');

        const checkName = () => {
            const val = name.value.trim();
            if (!val) return 'Tenés que ingresar el nombre del producto';
            if (val.length < 5) return 'El nombre debe tener al menos 5 caracteres';
            return '';
        };

        const checkPrice = () => {
            const val = price.value.trim();
            if (!val) return 'Tenés que ingresar el precio del producto';
            if (Number(val) <= 0 || isNaN(Number(val))) return 'El precio debe ser un número mayor a 0';
            return '';
        };

        const checkImage = () => validarImagen(image);

        const checkDescription = () => {
            const val = description.value.trim();
            if (!val) return 'Tenés que ingresar una descripción';
            if (val.length < 20) return 'La descripción debe tener al menos 20 caracteres';
            return '';
        };

        activarFeedbackEnVivo(name, checkName);
        activarFeedbackEnVivo(price, checkPrice);
        activarFeedbackEnVivo(image, checkImage);
        activarFeedbackEnVivo(description, checkDescription);

        formProd.addEventListener('submit', (e) => {
            const errName = checkName();
            const errPrice = checkPrice();
            const errImage = checkImage();
            const errDesc = checkDescription();

            mostrarError(name, errName);
            mostrarError(price, errPrice);
            mostrarError(image, errImage);
            mostrarError(description, errDesc);

            if (errName || errPrice || errImage || errDesc) {
                e.preventDefault();
            }
        });
    });
});