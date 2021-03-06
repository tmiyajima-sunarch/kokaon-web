import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest';
import { rest } from 'msw';
import 'whatwg-fetch';
import { server } from '../mocks/server';
import { DefaultApiClient } from './default';
import { ResponseError } from './errors';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('createRoom()', () => {
  const sut = new DefaultApiClient('http://localhost:8080');

  test('Success', async () => {
    server.use(
      rest.post('http://localhost:8080/api/v1/room', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            roomId: 'test',
            passcode: '000000',
          })
        );
      })
    );

    const result = await sut.createRoom('なまえ');

    expect(result).toEqual({
      roomId: 'test',
      passcode: '000000',
    });
  });

  test('Client error', async () => {
    server.use(
      rest.post('http://localhost:8080/api/v1/room', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            message: 'failure',
          })
        );
      })
    );

    const promise = sut.createRoom('なまえ');
    expect(promise).rejects.toThrowError(ResponseError);
  });
});

describe('validateRoom()', () => {
  const sut = new DefaultApiClient('http://localhost:8080');

  test('Success', async () => {
    server.use(
      rest.post(
        'http://localhost:8080/api/v1/room/:roomId/validate',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              roomId: req.params.roomId,
              ok: true,
            })
          );
        }
      )
    );

    const result = await sut.validateRoom('test', 'passcode');

    expect(result).toEqual({
      roomId: 'test',
      ok: true,
    });
  });

  test('Client error', async () => {
    server.use(
      rest.post(
        'http://localhost:8080/api/v1/room/:roomId/validate',
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              message: 'failure',
            })
          );
        }
      )
    );

    const promise = sut.validateRoom('test', 'passcode');
    expect(promise).rejects.toThrowError(ResponseError);
  });
});

describe('addAudio', () => {
  const sut = new DefaultApiClient('http://localhost:8080');

  test('Success', async () => {
    server.use(
      rest.post(
        'http://localhost:8080/room/:roomId/audios',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              roomId: req.params.roomId,
              audioId: 'audio',
              audioName: 'name',
            })
          );
        }
      )
    );

    const result = await sut.addAudio(
      'test',
      new File([''], 'dummy.mp3'),
      'name'
    );

    expect(result).toEqual({
      roomId: 'test',
      audioId: 'audio',
      audioName: 'name',
    });
  });
});

describe('removeAudio()', () => {
  const sut = new DefaultApiClient('http://localhost:8080');

  test('Success', async () => {
    server.use(
      rest.delete(
        'http://localhost:8080/api/v1/room/:roomId/audios/:audioId',
        (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              roomId: req.params.roomId,
              audioId: req.params.audioId,
            })
          );
        }
      )
    );

    const result = await sut.removeAudio('test', 'audio');

    expect(result).toEqual({
      roomId: 'test',
      audioId: 'audio',
    });
  });

  test('Client error', async () => {
    server.use(
      rest.delete(
        'http://localhost:8080/api/v1/room/:roomId/audios/:audioId',
        (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              message: 'failure',
            })
          );
        }
      )
    );

    const promise = sut.removeAudio('test', 'audio');
    expect(promise).rejects.toThrowError(ResponseError);
  });
});
