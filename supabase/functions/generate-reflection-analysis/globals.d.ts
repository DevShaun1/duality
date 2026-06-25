declare const Deno: {
  env: {
    get(name: string): string | undefined;
  };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};

declare module 'openai' {
  type ResponsesCreateParams = {
    model: string;
    input: string;
  };

  export default class OpenAI {
    constructor(options: { apiKey?: string });

    responses: {
      create(params: ResponsesCreateParams): Promise<{
        output_text: string;
      }>;
    };
  }
}