export class TransportError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(
      message ? message : options?.cause ? options.cause.message : undefined,
      options
    );
    this.name = 'TransportError';
  }
}

export class ResponseError extends TransportError {
  constructor(
    public readonly response: Response,
    message?: string,
    options?: ErrorOptions
  ) {
    super(
      message
        ? message
        : options?.cause
        ? options.cause.message
        : `status code: ${response.status}`,
      options
    );
    this.name = 'ResponseError';
  }

  get status(): number {
    return this.response.status;
  }

  get json(): Promise<any> {
    return this.response.json();
  }
}

export class ClientError extends ResponseError {
  constructor(
    public readonly response: Response,
    message?: string,
    options?: ErrorOptions
  ) {
    super(response, message, options);
    this.name = 'ClientError';
  }
}

export class ServerError extends ResponseError {
  constructor(
    public readonly response: Response,
    message?: string,
    options?: ErrorOptions
  ) {
    super(response, message, options);
    this.name = 'ServerError';
  }
}

export class ResponseBodyError extends ResponseError {
  constructor(response: Response, message?: string, options?: ErrorOptions) {
    super(
      response,
      message ? message : options?.cause ? options.cause.message : undefined,
      options
    );
    this.name = 'ResponseBodyError';
  }
}
