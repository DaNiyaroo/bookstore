import { DocumentBuilder } from "@nestjs/swagger";


export const swaggerConfig = new DocumentBuilder()
    .setTitle('Post.com')
    .setDescription('API for writing posts')
    .setVersion('1.0')
    .addTag('Endpoints')
    .build();