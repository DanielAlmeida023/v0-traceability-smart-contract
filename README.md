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

## 🛠️ Configuración Local

### 1. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local`:

\`\`\`env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xTU_CONTRATO_AQUI
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Ejecutar en Desarrollo

\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🌐 Despliegue en Netlify

### Opción 1: Despliegue desde GitHub (Recomendado)

1. **Sube tu código a GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/tu-repo.git
   git push -u origin main
   \`\`\`

2. **Conecta con Netlify**
   - Ve a [https://app.netlify.com](https://app.netlify.com)
   - Haz clic en "Add new site" → "Import an existing project"
   - Selecciona "GitHub" y autoriza el acceso
   - Selecciona tu repositorio

3. **Configura el Build**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Netlify detectará automáticamente que es un proyecto Next.js

4. **Configura Variables de Entorno**
   - En el dashboard de Netlify, ve a "Site configuration" → "Environment variables"
   - Agrega las siguientes variables:
     \`\`\`
     NEXT_PUBLIC_CONTRACT_ADDRESS = 0xTU_CONTRATO_AQUI
     NEXT_PUBLIC_APP_URL = https://tu-sitio.netlify.app
     \`\`\`

5. **Despliega**
   - Haz clic en "Deploy site"
   - Espera a que termine el build (2-3 minutos)
   - Tu sitio estará disponible en `https://tu-sitio.netlify.app`

### Opción 2: Despliegue Manual (CLI)

1. **Instala Netlify CLI**
   \`\`\`bash
   npm install -g netlify-cli
   \`\`\`

2. **Inicia sesión**
   \`\`\`bash
   netlify login
   \`\`\`

3. **Inicializa el sitio**
   \`\`\`bash
   netlify init
   \`\`\`

4. **Configura variables de entorno**
   \`\`\`bash
   netlify env:set NEXT_PUBLIC_CONTRACT_ADDRESS "0xTU_CONTRATO_AQUI"
   netlify env:set NEXT_PUBLIC_APP_URL "https://tu-sitio.netlify.app"
   \`\`\`

5. **Despliega**
   \`\`\`bash
   netlify deploy --prod
   \`\`\`

### Verificación Post-Despliegue

Después de desplegar, verifica:

1. ✅ **Variables de entorno**: Ve a Site configuration → Environment variables
2. ✅ **Build logs**: Revisa que no haya errores en el build
3. ✅ **Consola del navegador**: Abre DevTools (F12) y verifica que no haya errores
4. ✅ **MetaMask**: Conecta tu wallet y verifica que esté en Scroll Sepolia
5. ✅ **Permisos**: Confirma que tu wallet tenga EMITTER_ROLE en el contrato

### Solución de Problemas en Netlify

#### Error: "Cannot connect to MetaMask"
- Asegúrate de que MetaMask esté instalado y desbloqueado
- Verifica que estés en la red Scroll Sepolia (Chain ID: 534351)

#### Error: "Transaction failed"
- Verifica que tu wallet tenga EMITTER_ROLE
- Confirma que tengas suficiente ETH en Scroll Sepolia para gas
- Revisa la consola del navegador (F12) para ver logs detallados

#### Error: "API route not found"
- Verifica que el archivo `netlify.toml` esté en la raíz del proyecto
- Confirma que las variables de entorno estén configuradas en Netlify

#### Build falla en Netlify
- Verifica que `package.json` tenga todas las dependencias
- Asegúrate de que Node.js sea versión 18 o superior
- Revisa los logs de build en el dashboard de Netlify

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

Dirección del contrato en Scroll Sepolia: Configura en `NEXT_PUBLIC_CONTRACT_ADDRESS`

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
- No se requieren claves privadas en el servidor (compatible con Netlify)

## 📝 Notas

- Los lotes se guardan localmente en localStorage para persistencia
- El QR contiene toda la información del lote + URL de verificación
- Las transacciones se pueden verificar en: https://sepolia.scrollscan.com
- El sistema incluye logs de debugging en la consola del navegador (F12)

## 🆘 Soporte

Si encuentras problemas:
1. Abre la consola del navegador (F12) y busca mensajes que empiecen con "[v0]"
2. Verifica que todas las variables de entorno estén configuradas
3. Confirma que tu wallet tenga EMITTER_ROLE en el contrato
4. Revisa los logs de build en Netlify si el despliegue falla
