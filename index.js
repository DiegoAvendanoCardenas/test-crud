// index.js

const mysql = require("mysql");
const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors());
app.use(express.json()); // Para parsear application/json

// Configuración de la conexión a la base de datos
const conexion = mysql.createConnection({
  user: "admin",
  host: "database-test.c0r91riiurqf.us-east-1.rds.amazonaws.com",
  password: "diego123",
  database: "dbtest",
});

// Conectar a la base de datos
conexion.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conexión a la base de datos exitosa");
});

// Endpoint para agregar un usuario
app.post("/adduser", (req, res) => {
  const { nameUser, email, age } = req.body;

  const sql = "INSERT INTO users (nameUser, email, age) VALUES (?, ?, ?)";
  conexion.query(sql, [nameUser, email, age], (err, result) => {
    if (err) {
      console.error("Error al agregar usuario:", err);
      res.status(500).json({ error: "Error al agregar usuario" });
    } else {
      console.log("Usuario agregado correctamente");
      res.status(200).json({ message: "Usuario agregado correctamente" });
    }
  });
});

// Endpoint para actualizar un usuario
app.put("/updateuser/:id", (req, res) => {
  const userId = req.params.id;
  const { nameUser, email, age } = req.body;

  const sql = "UPDATE users SET nameUser = ?, email = ?, age = ? WHERE id = ?";
  conexion.query(sql, [nameUser, email, age, userId], (err, result) => {
    if (err) {
      console.error("Error al actualizar usuario:", err);
      res.status(500).json({ error: "Error al actualizar usuario" });
    } else {
      console.log("Usuario actualizado correctamente");
      res.status(200).json({ message: "Usuario actualizado correctamente" });
    }
  });
});

// Endpoint para obtener todos los usuarios
app.get("/users", (req, res) => {
  conexion.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error al consultar usuarios:", err);
      res.status(500).json({ error: "Error al consultar usuarios" });
    } else {
      console.log("Usuarios obtenidos correctamente");
      res.status(200).json(results);
    }
  });
});

// Ruta para obtener un usuario por su ID
app.get("/getuser/:id", (req, res) => {
  const userId = req.params.id;
  const query = "SELECT * FROM users WHERE id = ?";
  conexion.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ error: "Error fetching user" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const user = results[0];
    res.status(200).json(user);
  });
});

// Endpoint para eliminar un usuario por ID
app.delete("/deleteuser/:id", (req, res) => {
  const userId = req.params.id;

  const sql = "DELETE FROM users WHERE id = ?";
  conexion.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error al eliminar usuario:", err);
      res.status(500).json({ error: "Error al eliminar usuario" });
    } else {
      console.log("Usuario eliminado correctamente");
      res.status(200).json({ message: "Usuario eliminado correctamente" });
    }
  });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});
