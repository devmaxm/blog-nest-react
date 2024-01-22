import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";

export class TestHelper {
    async initializeApp(): Promise<INestApplication> {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();
    
        const app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        return await app.init();
      }
}