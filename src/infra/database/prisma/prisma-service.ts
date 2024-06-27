import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor() {
		super({
			//generate query log when has an error or a warn
			log: ["error", "warn"],
		});
	}
	//disconnect prisma client if some error occurs on the application
	onModuleDestroy() {
		return this.$disconnect();
	}
	//create the prisma connection every time application starts
	onModuleInit() {
		return this.$connect();
	}

	getUsers() {
		return;
	}
}
