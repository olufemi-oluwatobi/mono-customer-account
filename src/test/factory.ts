import 'reflect-metadata';
import 'source-map-support/register';
import 'module-alias/register';

// Set env to test
process.env.NODE_ENV = 'test';

// Set env variables from .env file
import { config } from 'dotenv';
config();

import { createConnection, Connection } from 'typeorm';
import { createServer, Server as HttpServer } from 'http';

import * as  express from 'express';
import * as supertest from 'supertest';
import Server from '../server';

/**
 * TestFactory
 * - Loaded in each unit test
 * - Starts server and DB connection
 */

export class TestFactory {
    private _app: express.Application;
    private _connection: Connection;
    private _server: HttpServer;



    public get app(): supertest.SuperTest<supertest.Test> {
        return supertest(this._app);
    }

    public get connection(): Connection {
        return this._connection;
    }

    public get server(): HttpServer {
        return this._server;
    }

    public async init(): Promise<void> {
        // logger.info('Running startup for test case');
        await this.startup();
    }

    /**
     * Close server and DB connection
     */
    public async close(): Promise<void> {
        this._server.close();
        this._connection.close();
    }

    /**
     * Connect to DB and start server
     */
    private async startup(): Promise<void> {
        this._connection = await createConnection();
        this._app = new Server(8010).app;
        this._server = createServer(this._app).listen(8010);
    }
}