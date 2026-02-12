import {app} from "./app";
import { AppDataSource } from "./shared/database/data-source";


const PORT = process.env.PORT || 3000;


AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ API rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar no banco:", err);
    process.exit(1);
  });