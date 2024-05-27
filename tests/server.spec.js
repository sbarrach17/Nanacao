const request = require("supertest");
const server = require("../index");
const jwt = require("jwt-simple");

describe("Operaciones CRUD de cafes", () => {
  //     Testea que la ruta GET /cafes devuelve un status code 200 y el tipo de dato recibido
  // es un arreglo con por lo menos 1 objeto
  it("Status code 200, obtener cafes", async () => {
    const response = await request(server).get("/cafes").send();
    const status = response.statusCode;
    expect(status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Comprueba que se obtiene un código 404 al intentar eliminar un café con un id que
  // no existe. (
  it("Status Code 404, cafe inexistente", async () => {
    const token = jwt.encode({ user_id: 1 }, "secret");
    const response = await request(server)
      .delete("/cafes/9999")
      .set("Authorization", token)
      .send();
    const status = response.statusCode;
    expect(status).toBe(404);
    expect(response.body).toEqual({
      message: "No se encontró ningún cafe con ese id",
    });
  });

  //   Prueba que la ruta POST /cafes agrega un nuevo café y devuelve un código 201
  it("Status Code 201, Nuevo café", async () => {
    const id = Math.floor(Math.random() * 999);
    const producto = { id, nombre: "Cafe Mocca" };
    const response = await request(server)
    .post("/cafes")
    .send(producto);
    const status = response.statusCode;
    expect(status).toBe(201);
    expect(response.body).toContainEqual(producto);
  });

  //   Prueba que la ruta PUT /cafes devuelve un status code 400 si intentas actualizar un
  //   café enviando un id en los parámetros que sea diferente al id dentro del payload.
  it("Status Code 400, parametros distintos", async () => {
    const id = 1;
    const cafe = { id, nombre: "Late" };
    const response = await request(server).put(`/cafes/3`).send(cafe);
    const status = response.statusCode;
    expect(status).toBe(400);
    expect(response.body).toEqual({
      message: "El id del parámetro no coincide con el id del café recibido",
    });
  });
});
