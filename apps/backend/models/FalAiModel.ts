import { fal } from "@fal-ai/client";
import { BaseModel } from "./BaseModel";

export class FalAiModel{
    constructor(){
        
    }

    public async generateImage(prompt:string,tensorPath:string){
        //commenting now to check the flow and then check the fal the fal ai model
        // const {request_id,response_url}=await fal.queue.submit("fal-ai/flux-lora",{
        //     input:{
        //         prompt:prompt,
        //         loras:[{path:tensorPath,scale:1}]
        //     },
        //     webhookUrl:`${process.env.WEBHOOK_BASE_URL}/fal-ai/webhook/image`  
        // })

        // the base url is now a microservcie worker  running for the image updation 

        // the webhook url is thecalback url that will be hit but there is no one right now as local host is not ccesible by the falai

        return {
            request_id:"",
            response_url:""
        }
    }

    public async trainModel(zipUrl:string,triggerWord:string){

        // const {request_id,response_url}=await fal.queue.submit("fal-ai/flux-lora-fast-training",{
        //     input:{
        //         images_data_url:zipUrl,
        //         trigger_word:triggerWord,
        //     },
        //     webhookUrl:`${process.env.WEBHOOK_BASE_URL}/fal-ai/webhook/train`
        // })

        return {
            request_id:"",
            response_url:""
        }
    }
    //creataing the thumbnail
    public async generateModelThumbnail(tensorPath: string) {
        const response = await fal.subscribe("fal-ai/flux-lora", {
            input: {
                prompt: "Generate a thumbnail version of the model-generated image with a clear, high-contrast background.",
                loras: [{ path: tensorPath, scale: 1 }]
            },
        })
        return {
          imageUrl: response.data.images[0].url
        }
      }
    
}

