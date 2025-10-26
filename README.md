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
3. **Wallet con EMITTER_ROLE**: Tu wallet de MetaMask debe tener permisos de emisor en el contrato

## 🛠️ Configuración

### 1. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` basado en `.env.example`:

\`\`\`env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xTU_CONTRATO_AQUI
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

**Importante**: 
- Tu wallet de MetaMask debe tener el rol `EMITTER_ROLE` en el contrato
- Para otorgar el rol, el admin del contrato debe ejecutar: `setEmitter(tuAddress, true)`

## 📖 Uso

### Registrar un Lote

1. **Conectar Wallet**: Haz clic en "Conectar MetaMask" y autoriza la conexión
2. **Completar Formulario**: 
   - ID del Lote (formato: ID_NUMERO, ej: ID_123)
   - Contenido del producto
   - Cantidad
   - Fecha de fabricación (no mayor a 5 años de antigüedad)
   - Fecha de vencimiento (no mayor a 5 años desde hoy)
3. **Firmar Transacción**: Haz clic en "Firmar y Registrar Envío" y confirma en MetaMask
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
Frontend (Next.js + MetaMask)
    ↓
Smart Contract (Scroll Sepolia)
    ↓
API Routes (/api/generate-qr) - Solo para QR
\`\`\`

## 🔐 Seguridad

- Las transacciones se firman directamente desde tu wallet de MetaMask
- Tu clave privada nunca sale de tu navegador
- Solo wallets con EMITTER_ROLE pueden registrar lotes
- El sistema valida el formato de datos antes de enviar a blockchain

## 📝 Notas

- Los lotes se guardan localmente en localStorage para persistencia
- El QR contiene toda la información del lote + URL de verificación
- Las transacciones se pueden verificar en: https://sepolia.scrollscan.com
- Compatible con despliegue en Netlify sin necesidad de configurar claves privadas en el servidor
