# GUÍA RÁPIDA DE CORRECCIONES

## 🎯 ACCIONES URGENTES POR PRIORIDAD

### 🔴 PRIORIDAD 1 - CRÍTICO (No puede faltar)

#### 1️⃣ Validación de Límite de 4 Jugadores (PLUS)

**Archivo a editar:** `vsls:/v1/controllers/jugador.controller.js`  
**Función:** `crearJugador`  
**Líneas:** 9-26

**Código a reemplazar:**
```javascript
export const crearJugador = async (req, res) => {
	try {
		const datosJugador = req.validatedBody || req.body;
		const usuarioId = req.user?.id;

		if (!usuarioId) {
			return res.status(401).json({ message: "No autorizado" });
		}

		const jugadorCreado = await crearJugadorService({
			...datosJugador,
			usuario: usuarioId,
		});

		return res.status(201).json({
			message: "Jugador creado",
			jugador: jugadorCreado,
		});
	} catch (error) {
		console.error("Error al crear jugador:", error);
		return res.status(500).json({
			message: "Error al crear jugador",
			details: error?.message || "Error desconocido",
		});
	}
};
```

**Por este código:**
```javascript
export const crearJugador = async (req, res) => {
	try {
		const datosJugador = req.validatedBody || req.body;
		const usuarioId = req.user?.id;
		const userPlan = req.user?.plan;

		if (!usuarioId) {
			return res.status(401).json({ message: "No autorizado" });
		}

		// ✅ VALIDAR LÍMITE DE 4 PARA PLUS
		if (userPlan === 'plus') {
			const jugadoresCount = await obtenerJugadoresService(usuarioId);
			if (jugadoresCount.length >= 4) {
				return res.status(403).json({
					message: "Has alcanzado el máximo de 4 jugadores para el plan PLUS. Actualiza a PREMIUM para agregar más.",
					actual: jugadoresCount.length,
					máximo: 4
				});
			}
		}

		const jugadorCreado = await crearJugadorService({
			...datosJugador,
			usuario: usuarioId,
		});

		return res.status(201).json({
			message: "Jugador creado",
			jugador: jugadorCreado,
		});
	} catch (error) {
		console.error("Error al crear jugador:", error);
		return res.status(500).json({
			message: "Error al crear jugador",
			details: error?.message || "Error desconocido",
		});
	}
};
```

**Nota:** Necesitas también importar el service al principio del archivo:
```javascript
import { obtenerJugadoresService, ... } from "../services/jugador.services.js";
```

**Tiempo estimado:** 5 minutos

---

#### 2️⃣ Paginación en GET /jugadores/

**Archivo a editar:** `vsls:/v1/controllers/jugador.controller.js`  
**Función:** `obtenerJugadores`  
**Líneas:** 29-40

**Código a reemplazar:**
```javascript
export const obtenerJugadores = async (req, res) => {
	try {
		const jugadores = await obtenerJugadoresService();
		return res.json({
			message: "Jugadores obtenidos",
			jugadores,
		});
	} catch (error) {
		console.error("Error al obtener jugadores:", error);
		return res.status(500).json({
			message: "Error al obtener jugadores",
			details: error?.message || "Error desconocido",
		});
	}
};
```

**Por este código:**
```javascript
export const obtenerJugadores = async (req, res) => {
	try {
		const usuarioId = req.user?.id;
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;

		// ✅ CONSTRUIR FILTROS DINÁMICOS
		const filtros = { usuario: usuarioId };
		
		if (req.query.nombre) {
			filtros.nombre = { $regex: req.query.nombre, $options: 'i' };
		}
		if (req.query.apellido) {
			filtros.apellido = { $regex: req.query.apellido, $options: 'i' };
		}
		if (req.query.equipo) {
			filtros.equipo = { $regex: req.query.equipo, $options: 'i' };
		}
		if (req.query.nacionalidad) {
			filtros.nacionalidad = { $regex: req.query.nacionalidad, $options: 'i' };
		}
		if (req.query.posicion) {
			filtros.posicion = req.query.posicion;
		}

		// ✅ PAGINACIÓN + FILTROS
		const jugadores = await Jugador.find(filtros)
			.skip(skip)
			.limit(limit)
			.populate("posicion", "nombre descripcion")
			.populate("usuario", "email plan");

		const total = await Jugador.countDocuments(filtros);
		const totalPages = Math.ceil(total / limit);

		return res.json({
			message: "Jugadores obtenidos",
			jugadores,
			pagination: {
				currentPage: page,
				pageSize: limit,
				totalPages,
				totalItems: total,
				hasNextPage: page < totalPages,
				hasPreviousPage: page > 1
			}
		});
	} catch (error) {
		console.error("Error al obtener jugadores:", error);
		return res.status(500).json({
			message: "Error al obtener jugadores",
			details: error?.message || "Error desconocido",
		});
	}
};
```

**Necesitas importar Jugador al inicio del archivo:**
```javascript
import Jugador from "../models/jugador.model.js";
```

**Ejemplos de uso:**
```
GET /v1/jugadores?page=1&limit=10
GET /v1/jugadores?nombre=Messi
GET /v1/jugadores?equipo=Inter&page=1&limit=5
GET /v1/jugadores?posicion=ObjectId&nacionalidad=Argentina
GET /v1/jugadores?apellido=Rodriguez&limit=20
```

**Tiempo estimado:** 10 minutos

---

#### 3️⃣ Actualizar Service para filtrar por usuario

**Archivo a editar:** `vsls:/v1/services/jugador.services.js`  
**Función:** `obtenerJugadoresService`  
**Líneas:** 9-12

**Código a reemplazar:**
```javascript
export const obtenerJugadoresService = async () => {
	return await Jugador.find()
		// .populate("posicion")
		// .populate("usuario", "email rol plan");
};
```

**Por este código:**
```javascript
export const obtenerJugadoresService = async (usuarioId = null) => {
	const query = usuarioId ? { usuario: usuarioId } : {};
	return await Jugador.find(query)
		.populate("posicion", "nombre descripcion")
		.populate("usuario", "email rol plan");
};
```

**Tiempo estimado:** 3 minutos

---

### 🟡 PRIORIDAD 2 - IMPORTANTE (Muy recomendado)

#### 4️⃣ Actualizar model de Jugador para relaciones (Opcional pero recomendado)

**Nota:** Esto es para mejorar la calidad del populate. El modelo ya está bien, pero puedes considerar agregar índices:

En `vsls:/v1/models/jugador.model.js`, después del schema:
```javascript
jugadorSchema.index({ usuario: 1 });
jugadorSchema.index({ nombre: 'text', apellido: 'text' });
```

---

### 🔵 PRIORIDAD 3 - DOCUMENTACIÓN

#### 5️⃣ Crear Colección Postman

**Pasos:**
1. Abrir Postman
2. Crear nueva colección: "ObligatorioDFS1"
3. Agregar requests para cada endpoint

**Endpoints a documentar:**

**Auth (Desprotegidas):**
- POST `/v1/auth/register` - Registro
- POST `/v1/auth/login` - Login

**Jugadores (Protegidas):**
- POST `/v1/jugadores` - Crear
- GET `/v1/jugadores` - Listar (con paginación y filtros)
- GET `/v1/jugadores/:id` - Obtener por ID
- PATCH `/v1/jugadores/:id` - Actualizar
- DELETE `/v1/jugadores/:id` - Eliminar

**Categorías (Protegidas):**
- POST `/v1/categorias` - Crear
- GET `/v1/categorias` - Listar
- GET `/v1/categorias/:id` - Obtener por ID
- PATCH `/v1/categorias/:id` - Actualizar
- DELETE `/v1/categorias/:id` - Eliminar

**Usuarios (Protegidas):**
- PATCH `/v1/usuarios/cambiar-plan` - Cambiar plan

**Uploads (Protegidas):**
- POST `/v1/uploads` - Subir imagen

**IA (Protegidas):**
- GET `/v1/ai` - Listar modelos
- POST `/v1/ai` - Usar Gemini
- POST `/v1/ai/gemini-2.5-flash` - Usar Gemini específico

**Tiempo estimado:** 20 minutos

---

## 🧪 CÓMO PROBAR LAS CORRECCIONES

### Test 1: Validación de 4 jugadores
```bash
# 1. Registrar usuario con plan plus
POST /v1/auth/register
{
  "email": "test@test.com",
  "password": "Test123",
  "confirmPassword": "Test123",
  "plan": "plus"
}

# 2. Guardar token

# 3. Crear 4 jugadores (los 4 primeros deben funcionar)
POST /v1/jugadores
Authorization: Bearer [TOKEN]
{
  "nombre": "Jugador1",
  "apellido": "Prueba",
  "edad": 25,
  "posicion": "[CATEGORIA_ID]",
  "equipo": "Team",
  "nacionalidad": "Argentina"
}

# 4. El quinto debe retornar 403
POST /v1/jugadores
Authorization: Bearer [TOKEN]
{
  "nombre": "Jugador5",
  "apellido": "Prueba",
  "edad": 25,
  "posicion": "[CATEGORIA_ID]",
  "equipo": "Team",
  "nacionalidad": "Argentina"
}

# ✅ ESPERADO: { "message": "Has alcanzado el máximo...", "actual": 4, "máximo": 4 }
```

### Test 2: Paginación
```bash
# Prueba paginación
GET /v1/jugadores?page=1&limit=5

# ✅ ESPERADO: { "jugadores": [...], "pagination": { "currentPage": 1, "pageSize": 5, ... } }
```

### Test 3: Filtros
```bash
# Filtrar por nombre
GET /v1/jugadores?nombre=Messi

# Filtrar por equipo
GET /v1/jugadores?equipo=Inter&page=1&limit=10

# ✅ ESPERADO: Solo jugadores que coincidan con el filtro
```

---

## 📝 RESUMEN DE CAMBIOS

| Archivo | Función | Cambio | Líneas |
|---------|---------|--------|--------|
| jugador.controller.js | crearJugador | Agregar validación de límite | +15 |
| jugador.controller.js | obtenerJugadores | Agregar paginación y filtros | +35 |
| jugador.services.js | obtenerJugadoresService | Agregar parámetro usuarioId | +2 |

**Total de líneas de código:** ~50  
**Tiempo total estimado:** 20 minutos  
**Complejidad:** Media  
**Impacto en puntuación:** +25 puntos (65 → 90)

---

## ✅ CHECKLIST FINAL

- [ ] Validación de 4 jugadores implementada
- [ ] Paginación implementada
- [ ] Filtros implementados
- [ ] Service actualizado
- [ ] Tests de validación ejecutados
- [ ] Tests de paginación ejecutados
- [ ] Tests de filtros ejecutados
- [ ] Colección Postman creada
- [ ] Documentación Postman completada
- [ ] Código commiteado

---

**Si implementas TODOS estos cambios, tu proyecto pasará de 65% a ~90% de cumplimiento.**

