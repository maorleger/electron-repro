const { InteractiveBrowserCredential } = require("@azure/identity");

const { BlobClient, BlobServiceClient } = require("@azure/storage-blob");

const baseURI = "<REPLACE WITH STORAGE URI>";

// Replace this with path to a blob that is private / needs auth
// to repro the InteractiveBrowserCredential case
const privateBlob = {
  container: "test",
  blob: "todo.txt",
};

// Replace this with path to a public blob. Since this sample contains
// both bugs it's just easier to have no auth at all to demonstrate
// the blobBody / downloadToBuffer bug
const publicBlob = {
  container: "public",
  blob: "README.md",
};

document.getElementById("auth-bug").addEventListener("click", () => {
  new BlobServiceClient(baseURI, new InteractiveBrowserCredential())
    .getContainerClient(privateBlob.container)
    .getBlobClient(privateBlob.blob)
    .download()
    .then((resp) => {
      console.log(resp.blobBody);
    })
    .catch((err) => console.log("auth error", err));
});

document.getElementById("blob-body-bug").addEventListener("click", () => {
  new BlobServiceClient(baseURI)
    .getContainerClient(publicBlob.container)
    .getBlobClient(publicBlob.blob)
    .download()
    .then((resp) => {
      console.log(
        "blobBody which should not be null in a browser",
        resp.blobBody
      );
    })
    .catch((err) => console.log(err));

  new BlobServiceClient(baseURI)
    .getContainerClient(publicBlob.container)
    .getBlobClient(publicBlob.blob)
    .downloadToBuffer()
    .then((resp) => {
      console.log(
        "buffer which should only be available in node",
        resp.toString()
      );
    })
    .catch((err) => {
      console.log(err);
      return Promise.resolve();
    });
});
