import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

model Process {
  id                      String                    @id @default(uuid())
  processNumber   String?  // numero do processo (pode ser nulo se preferir)
  reportDate      DateTime?
  summary         String?  @db.Text
  questionAnswers Json?    // armazena respostas em JSON (array/objeto)
  transcriptId    String?     
  deleted         Boolean  @default(false)
  status          String?  // pode transformar em enum se quiser valores fixos
  email           String? 
  errorMessage    String?  @db.Text
  title           String?
  mediaName       String?
  observations    String?  @db.Text
  
  transcript      Transcript? @relation(fields: [transcriptId], references: [id], onDelete: SetNull)

  @@map("processes")
  @@index([processNumber])
  @@index([transcriptId])
}

model Transcript {
  id            Int      @id @default(autoincrement())
  org           String?
  title         String?
  url           String?
  transcript    String?  @db.Text
  summary       String?  @db.Text
  topics        String[] // array de tópicos
  keywords      String[] // array de palavras-chave
  transcriptDate DateTime?
  path          String?
  audioType     String?

  processes     Process[] // relação inversa

  @@map("transcripts")
  @@index([transcriptDate])
}