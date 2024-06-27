import { Client } from '@elastic/elasticsearch';

// Initialize Elasticsearch client
const esClient = new Client({ node: process.env.ELASTIC_SEARCH_PORT }); // Replace with your Elasticsearch server URL

// Export the Elasticsearch client instance for use in other files if needed
export { esClient };

// Indexing function
export async function indexFileToElasticsearch(fileKey: string, fileName: string, userId: string) {
  try {
    const indexResponse = await esClient.index({
      index: 'files',
      body: {
        fileKey,
        fileName,
        userId,
        timestamp: new Date()
      }
    });

    console.log(`Indexed file ${fileName} to Elasticsearch`);
  } catch (error) {
    console.error(`Error indexing file ${fileName} to Elasticsearch: ${error}`);
  }
}
