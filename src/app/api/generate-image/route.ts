import { fal } from "@fal-ai/client";

if (!process.env.FAL_API_KEY) {
  throw new Error('FAL API key not configured');
}

fal.config({
  credentials: process.env.FAL_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return Response.json({ error: 'No prompt provided' }, { status: 400 });
    }

    console.log('Calling FAL.ai with prompt:', prompt);
    
    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt: `A detailed, educational illustration of ${prompt}, with clear labels and annotations, in the style of a geography textbook diagram. High quality, clear, and informative. Avoid: blurry, low quality, cartoonish, unrealistic, confusing, messy text, unclear labels.`,
        image_size: "square_hd",
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 2,
        enable_safety_checker: true
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log('Generation progress:', update.logs.map((log) => log.message));
        }
      },
    });

    console.log('FAL.ai response:', result);

    if (!result?.data?.images?.[0]?.url) {
      console.error('Invalid response from FAL.ai:', result);
      return Response.json({ error: 'Invalid response from image generation API' }, { status: 500 });
    }
    
    return Response.json({ 
      imageUrls: result.data.images.map(img => img.url),
      requestId: result.requestId
    });
    
  } catch (error: any) {
    console.error('Error in generate-image API:', error);
    return Response.json({ error: error.message || 'An unexpected error occurred' }, { status: 500 });
  }
} 