import { CategoriasModule } from './categorias/categorias.module';
import { SubcategoriasModule } from './subcategorias/subcategorias.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: false,
      autoLoadEntities: true,
    }),
    UsuariosModule,
    CategoriasModule, // Agrega aquí
    SubcategoriasModule, // Agrega aquí
    DomicilioModule,
    TelefonoModule,
    RfcModule,
    NssModule,
    EmailModule,
    ImgUsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
