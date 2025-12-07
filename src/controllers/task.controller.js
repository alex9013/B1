import Task from "../models/Task.js";

const allwed = ['Pendiente', 'En Progreso', 'Completada'];


export async function list(req, res) {
    try {
        const items = await Task.find({user: req.userId, deleted:false}).sort({createdAt:-1});
        res.json({items});
    } catch (e) {
        res.status(500).json({ message: 'Error del servidor' });
    }
}

export async function create(req, res) {
    try {
        const {title, description = '', status = 'Pendiente', clienteId} = req.body;
        if(!title) return res.status(400).json({message: 'El titulo es requerido'});

        const task = await Task.create({
            user: req.userId,
            title,
            description,
            status: allwed.includes(status) ? status : 'Pendiente',
            clienteId
        });
        res.status(201).json({task});
    } catch (e) {
        res.status(500).json({ message: 'Error del servidor' });
    }
}

export async function update(req, res) {
    try {
        const {id} = req.params;
        const {title, description, status} = req.body;
        
        if (status && !allwed.includes(status))
            return res.status(400).json({message: 'Estado invalido'});

        const task = await Task.findOneAndUpdate(
            {_id:id, user:req.userId},
            {title, description, status},
            {new:true}
        );
        if(!task) return res.status(404).json({message: 'Tarea no encontrada'});
        res.json({task});
    } catch (e) {
        res.status(500).json({ message: 'Error del servidor' });
    }
}

export async function remove(req, res) {
    try {
        const { id } = req.params;

        const task = await Task.findOneAndDelete({
            _id: id,
            user: req.userId
        });

        if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ message: 'Error del servidor' });
    }
}


//ENDPOINT PARA SINCRONIZACION OFFLINE: CREAR/ ACTUALIZAR POR CLIENTE Y DEVOLVER EL MAPEO
export async function bulksync(req, res) {
    try {
        const { tasks } = req.body;
        const mapping = [];

        for (const item of tasks) {
            // 1. Desestructurar item (o usar item.propiedad directamente)
            const { clienteId, title, description = '', status = 'Pendiente' } = item;

            // 2. Usar clienteId y title para la validación
            if (!clienteId || !title) continue; 

            // 3. Buscar usando item.clienteId
            let doc = await Task.findOne({ user: req.userId, clienteId: clienteId }); 
            
            if (!doc) {
                // 4. Crear usando las variables desestructuradas
                doc = await Task.create({
                    user: req.userId,
                    title,
                    description,
                    status: allwed.includes(status) ? status : 'Pendiente',
                    clienteId // Guardamos el clienteId para futuras referencias
                });
            } else {
                // 5. Actualizar si existe, usando las variables desestructuradas
                doc.title = title ?? doc.title;
                doc.description = description ?? doc.description;
                if (status && allwed.includes(status)) doc.status = status;
                await doc.save();
            }
            
            // 6. Push al mapeo
            mapping.push({ clienteId: clienteId, serverId: String(doc._id) });
        }
        res.json({ mapping });
    } catch (e) {
        res.status(500).json({ message: 'Error del servidor' });
    }
}