import { Component, OnInit } from '@angular/core';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { environment } from 'src/environments/environment';

import { gptModels } from '../models/constants';
import { ResponseModel } from '../models/gpt-response';


@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['demo.component.css'],
})
export class DemoComponent implements OnInit {
  response!: ResponseModel | undefined;
  gptModels = gptModels
  promptText = '';
  configuration = new Configuration({ apiKey: environment.apiKey });
  openai = new OpenAIApi(this.configuration);
  messages!: ChatCompletionRequestMessage[];
  private shakespeareQuoteContext: ChatCompletionRequestMessage[] = [];

  showSpinner = false;

  constructor(

  ) { }

  ngOnInit(): void {

  }

  checkResponse() {
    this.SendMess();
  }

  getText(data: string) {
    return data.split('\n').filter(f => f.length > 0);
  }

  async SendMess() {
    this.shakespeareQuoteContext = []
    if (this.promptText.length < 2)
      return;

    try {
      const prompt: ChatCompletionRequestMessage = { role: 'user', content: 'Hello' };
      this.shakespeareQuoteContext.push(prompt)
      this.messages = this.shakespeareQuoteContext;
      this.response = undefined;

      let requestData = {
        model: "gpt-3.5-turbo",
        messages: this.messages,
        temperature: 0.6,
        max_tokens: 1000,
      };
      this.showSpinner = true;
      let apiResponse = await this.openai.createChatCompletion(requestData);
      const content = apiResponse.data.choices[0].message?.content;
      console.log("contentcontentcontent", content)

      this.response = apiResponse.data as ResponseModel;
      this.showSpinner = false;
    } catch (error: any) {
      this.showSpinner = false;
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);

      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);

      }
    }
  }

  generatePrompt(animal: string) {
    const capitalizedAnimal =
      animal[0].toUpperCase() + animal.slice(1).toLowerCase();
    return `Suggest three names for an animal that is a superhero.
  Animal: Cat
  Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
  Animal: Dog
  Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
  Animal: ${capitalizedAnimal}
  Names:`;
  }


}


//https://beta.openai.com/docs/api-reference/completions/create