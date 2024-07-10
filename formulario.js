// formulario.js

// Función para mostrar usuarios en la tabla
const mostrarUsuarios = (usuarios) => {
  const tableBody = document.getElementById("usersTableBody");
  tableBody.innerHTML = "";

  usuarios.forEach((usuario) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${usuario.id}</td>
      <td>${usuario.nameUser}</td>
      <td>${usuario.email}</td>
      <td>${usuario.age}</td>
      <td>
        <button onclick="editarUsuario(${usuario.id})">Editar</button>
        <button onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
};

// Función para editar un usuario
const editarUsuario = (id) => {
  console.log(`Editar usuario con ID: ${id}`);

  fetch(`http://localhost:3000/getuser/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Hubo un problema al obtener los datos del usuario.");
      }
      return response.json();
    })
    .then((usuario) => {
      // Asignar los valores del usuario a los campos del formulario
      document.getElementById("userId").value = usuario.id; // Nuevo campo oculto para almacenar el ID
      document.getElementById("nameUser").value = usuario.nameUser;
      document.getElementById("email").value = usuario.email;
      document.getElementById("age").value = usuario.age;
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hubo un error al obtener los datos del usuario.");
    });
};

// Función para eliminar un usuario
const eliminarUsuario = (id) => {
  if (confirm("¿Estás seguro que deseas eliminar este usuario?")) {
    fetch(`http://localhost:3000/deleteuser/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Hubo un problema al eliminar el usuario.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        alert("Usuario eliminado correctamente.");
        cargarUsuarios(); // Actualizar la lista de usuarios después de eliminar
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Hubo un error al eliminar el usuario.");
      });
  }
};

// Función para habilitar/deshabilitar el botón de enviar
const validarFormulario = () => {
  const nameUser = document.getElementById("nameUser").value.trim();
  const email = document.getElementById("email").value.trim();
  const age = document.getElementById("age").value.trim();
  const submitButton = document.getElementById("submitButton");

  if (nameUser && email && age) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
};

// Función para cargar usuarios desde el servidor y mostrar en la tabla
const cargarUsuarios = () => {
  fetch("http://localhost:3000/users")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Hubo un problema al obtener los usuarios.");
      }
      return response.json();
    })
    .then((usuarios) => {
      console.log("Usuarios obtenidos:", usuarios);
      mostrarUsuarios(usuarios);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hubo un error al obtener los usuarios.");
    });
};

// Función para enviar datos del formulario
const enviarDatos = () => {
  const id = document.getElementById("userId").value; // Añadido para capturar el ID del usuario
  const nameUser = document.getElementById("nameUser").value.trim();
  const email = document.getElementById("email").value.trim();
  const age = parseInt(document.getElementById("age").value.trim()); // Convertir a número entero

  const data = {
    nameUser: nameUser,
    email: email,
    age: age,
  };

  const url = id
    ? `http://localhost:3000/updateuser/${id}`
    : "http://localhost:3000/adduser";
  const method = id ? "PUT" : "POST";

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Hubo un problema al enviar los datos.");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Respuesta del servidor:", data);
      alert(
        id
          ? "Datos actualizados correctamente."
          : "Datos enviados correctamente."
      );
      // Limpiar formulario después de enviar o actualizar
      document.getElementById("myForm").reset();
      // Deshabilitar el botón de enviar hasta que los campos estén completos
      validarFormulario();
      cargarUsuarios(); // Actualizar la lista de usuarios
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Hubo un error al enviar los datos.");
    });
};

// Añadir event listeners para validar el formulario en tiempo real
document
  .getElementById("nameUser")
  .addEventListener("input", validarFormulario);
document.getElementById("email").addEventListener("input", validarFormulario);
document.getElementById("age").addEventListener("input", validarFormulario);

// Cargar usuarios al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarios();
});
