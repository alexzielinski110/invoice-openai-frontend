import httpHandler from "react-http-client";
import { Buffer } from "buffer";

let accessToken = "";

const getToken = () => {
  return new Promise((resolve, reject) => {
    // Settle this promise in the response callback for requestAccessToken()
    client.callback = (resp) => {
      if (resp.error !== undefined) resolve("");

      resolve(resp.access_token);
    };

    client.requestAccessToken();
  });
};

const GoogleDocAIService = {
  getMetadata: async (fileObj) => {
    const projectId = "prj-d-contract-doc-ai-1";
    const location = "us";
    const processorId = "76201d7043ecc8af";

    const endpoint = `https://us-documentai.googleapis.com/v1/projects/${projectId}/locations/${location}/processors/${processorId}:process`;

    const filters = [
      "supplier_name",
      "supplier_address",
      "receiver_name",
      "receiver_address",
      "invoice_date",
      "due_date",
      "delivery_date",
      "total_amount",
      "currency",
    ];

    const arrayBuffer = await fileObj.arrayBuffer();
    // Convert the image data to a Buffer and base64 encode it.
    const encodedImage = Buffer.from(arrayBuffer).toString('base64');

    const params = {
      rawDocument: {
        content: encodedImage,
        mimeType: "application/pdf",
      },
    };

    if (accessToken == "") accessToken = await getToken();

    const httpOptions = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    };

    const result = await httpHandler.post(endpoint, params, httpOptions);

    const metadata = new Array();
    // Read the text recognition output from the processor
    result.document.entities.forEach((entity) => {
      if (filters.includes(entity.type)) {
        const value =
          entity.normalizedValue &&
          entity.normalizedValue.text &&
          entity.normalizedValue.text.length > 0
            ? entity.normalizedValue.text
            : entity.mentionText;

        metadata[entity.type] = value.replace(/\s+/g, " ").trim();
      }
    });

    return metadata;
  },
};

export default GoogleDocAIService;
