import { Component, OnInit } from '@angular/core';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { environment } from 'src/environments/environment';
import { gptModels } from '../models/constants';
import { ChatWithBot, ResponseModel } from '../models/gpt-response';

@Component({
  selector: 'app-customer-support',
  templateUrl: './customer-support.component.html',
  styleUrls: ['./customer-support.component.css']
})
export class CustomerSupportComponent implements OnInit {
  chatConversation: ChatWithBot[] = [];
  configuration = new Configuration({ apiKey: environment.apiKey });
  openai = new OpenAIApi(this.configuration);
  messages!: ChatCompletionRequestMessage[];
  private shakespeareQuoteContext: ChatCompletionRequestMessage[] = [];
  response!: ResponseModel | undefined;
  gptModels = gptModels
  promptText = '';
  showSpinner = false;

  constructor() { }

  ngOnInit(): void {
  }

  checkResponse() {
    this.pushChatContent(this.promptText, 'You', 'person');
    this.SendMess();
  }


  pushChatContent(content: string, person: string, cssClass: string) {
    const chatToPush: ChatWithBot = { person: person, response: content, cssClass: cssClass };
    this.chatConversation.push(chatToPush);
  }


  getText(data: string) {
    return data.split('\n').filter(f => f.length > 0);
  }

  async SendMess() {
    this.shakespeareQuoteContext = []
    if (this.promptText.length < 2)
      return;

    try {
      const prompt: ChatCompletionRequestMessage = { role: 'user', content: this.promptText };
      this.shakespeareQuoteContext.push(prompt)
      this.messages = this.shakespeareQuoteContext;
      this.response = undefined;

      let requestData = {
        model: "gpt-3.5-turbo",
        messages: this.messages,
        temperature: 1,
        max_tokens: 3000,
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

}
