import { rest } from 'msw';

export const handlers = [
  rest.post('http://localhost:8080/api/v1/room', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        roomId: 'test',
        passcode: '000000',
      })
    );
  }),

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
  ),

  rest.post(
    'http://localhost:8080/api/v1/room/:roomId/audios',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          roomId: req.params.roomId,
          audioId: 'audio',
        })
      );
    }
  ),
];
