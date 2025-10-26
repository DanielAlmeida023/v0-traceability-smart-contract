# Sistema Emisor - Trazabilidad Blockchain

Sistema de trazabilidad para emisores que permite registrar lotes de productos en blockchain (Scroll Sepolia) y generar códigos QR.

## 🚀 Características

- ✅ Conexión con MetaMask
- ✅ Registro de lotes en blockchain
- ✅ Generación automática de códigos QR
- ✅ Historial de envíos
- ✅ Integración con smart contract TraceabilityV1
- ✅ Verificación de transacciones en Scroll Sepolia

## 📋 Requisitos Previos

1. **Smart Contract Desplegado**: Debes tener el contrato `TraceabilityV1` desplegado en Scroll Sepolia
2. **MetaMask**: Extensión de navegador instalada
3. **Wallet con EMITTER_ROLE**: El backend necesita una wallet con permisos de emisor en el contrato

## 🛠️ Configuración

### 1. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` basado en `.env.example`:

\`\`\`env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xTU_CONTRATO_AQUI
BACKEND_PRIVATE_KEY=0xTU_PRIVATE_KEY_AQUI
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

**Importante**: 
- La wallet del `BACKEND_PRIVATE_KEY` debe tener el rol `EMITTER_ROLE` en el contrato
- Para otorgar el rol, el admin del contrato debe ejecutar: `setEmitter(address, true)`

### 3. Ejecutar en Desarrollo

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📖 Uso

### Registrar un Lote

1. **Conectar Wallet**: Haz clic en "Conectar MetaMask" y autoriza la conexión
2. **Completar Formulario**: 
   - ID del Lote (único)
   - Contenido del producto
   - Cantidad
   - Fecha de fabricación
   - Fecha de vencimiento
3. **Registrar**: Haz clic en "Registrar Envío"
4. **Confirmación**: El sistema generará el QR y registrará en blockchain

### Ver Historial

- La tabla muestra todos los lotes registrados
- Puedes ver el QR haciendo clic en el ícono correspondiente
- Puedes verificar la transacción en Scroll Sepolia Explorer

## 🔗 Smart Contract

El contrato `TraceabilityV1` incluye:

- **registrarEnviado**: Registra un lote como enviado (requiere EMITTER_ROLE)
- **estadoBatch**: Consulta el estado de un lote
- **Eventos**: `Enviado` y `Recibido` para tracking

## 🏗️ Arquitectura

\`\`\`
Frontend (Next.js)
    ↓
API Routes (/api/generate-qr, /api/register-batch)
    ↓
Smart Contract (Scroll Sepolia)
\`\`\`

## 🔐 Seguridad

- Las private keys nunca se exponen al frontend
- El backend actúa como relayer para firmar transacciones
- Solo wallets con EMITTER_ROLE pueden registrar lotes

## 📝 Notas

- Los lotes se guardan localmente en localStorage para persistencia
- El QR contiene toda la información del lote + URL de verificación
- Las transacciones se pueden verificar en: https://sepolia.scrollscan.com
