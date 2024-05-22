import Admonition from "@theme/Admonition";

# NotionPageContent Component in Langflow

Langflow allows you to extend its functionality with custom components. The `NotionPageContent` component is designed to retrieve the content of a Notion page as plain text. It provides a convenient way to integrate Notion page content into your Langflow workflows.

> **Component Functionality**
>
> The `NotionPageContent` component enables you to:
>
> - Retrieve the content of a Notion page as plain text
> - Extract text from various block types, including paragraphs, headings, lists, and more
> - Integrate Notion page content seamlessly into your Langflow workflows

## Component Usage

To use the `NotionPageContent` component in a Langflow flow, follow these steps:

1. Add the `NotionPageContent` component to your flow.
2. Configure the component by providing the required inputs:
   - `page_id`: The ID of the Notion page you want to retrieve.
   - `notion_secret`: Your Notion integration token for authentication.
3. Connect the output of the `NotionPageContent` component to other components in your flow as needed.

Here's the code block for the `NotionPageContent` component:

```python
import requests
from typing import Dict, Any
from langflow import CustomComponent
from langflow.schema import Record

class NotionPageContent(CustomComponent):
    display_name = "Page Content Viewer [Notion]"
    description = "Retrieve the content of a Notion page as plain text."
    documentation: str = "https://developers.notion.com/reference/get-page"
    icon = "NotionDirectoryLoader"

    def build_config(self):
        return {
            "page_id": {
                "display_name": "Page ID",
                "field_type": "str",
                "info": "The ID of the Notion page to retrieve.",
            },
            "notion_secret": {
                "display_name": "Notion Secret",
                "field_type": "str",
                "info": "The Notion integration token.",
                "password": True,
            },
        }

    def build(self, page_id: str, notion_secret: str) -> Record:
        blocks_url = f"https://api.notion.com/v1/blocks/{page_id}/children?page_size=100"
        headers = {
            "Authorization": f"Bearer {notion_secret}",
            "Notion-Version": "2022-06-28", # Use the latest supported version
        }
        # Retrieve the child blocks
        blocks_response = requests.get(blocks_url, headers=headers)
        blocks_response.raise_for_status()
        blocks_data = blocks_response.json()
        # Parse the blocks and extract the content as plain text
        content = self.parse_blocks(blocks_data["results"])
        self.status = content
        return Record(data={"content": content}, text=content)

    def parse_blocks(self, blocks: list) -> str:
        content = ""
        for block in blocks:
            block_type = block["type"]
            if block_type in ["paragraph", "heading_1", "heading_2", "heading_3", "quote"]:
                content += self.parse_rich_text(block[block_type]["rich_text"]) + "\n\n"
            elif block_type in ["bulleted_list_item", "numbered_list_item"]:
                content += self.parse_rich_text(block[block_type]["rich_text"]) + "\n"
            elif block_type == "to_do":
                content += self.parse_rich_text(block["to_do"]["rich_text"]) + "\n"
            elif block_type == "code":
                content += self.parse_rich_text(block["code"]["rich_text"]) + "\n\n"
            elif block_type == "image":
                content += f"[Image: {block['image']['external']['url']}]\n\n"
            elif block_type == "divider":
                content += "---\n\n"
        return content.strip()

    def parse_rich_text(self, rich_text: list) -> str:
        text = ""
        for segment in rich_text:
            text += segment["plain_text"]
        return text
```

> **Example Usage**
>
> Here's an example of how you can use the `NotionPageContent` component in a Langflow flow:
>
> ```jsx
> import ThemedImage from "@theme/ThemedImage";
> import useBaseUrl from "@docusaurus/useBaseUrl";
> import ZoomableImage from "/src/theme/ZoomableImage.js";
> 
> <ZoomableImage
>     alt="NotionPageContent Flow Example"
>     sources={{
>         light: "img/NotionPageContent_flow_example.png",
>         dark: "img/NotionPageContent_flow_example.png",
>     }}
>     style={{ width: "100%", margin: "20px 0" }}
> />
> ```

## Best Practices

> **Best Practices**
>
> When using the `NotionPageContent` component, consider the following best practices:
>
> - Ensure that you have the necessary permissions to access the Notion page you want to retrieve.
> - Keep your Notion integration token secure and avoid sharing it publicly.
> - Be mindful of the content you retrieve and ensure that it aligns with your intended use case.

## Troubleshooting

> **Troubleshooting**
>
> If you encounter any issues while using the `NotionPageContent` component, consider the following:
>
> - Double-check that you have provided the correct Notion page ID.
> - Verify that your Notion integration token is valid and has the necessary permissions.
> - Check the Notion API documentation for any updates or changes that may affect the component's functionality.

The `NotionPageContent` component provides a seamless way to integrate Notion page content into your Langflow workflows. By leveraging this component, you can easily retrieve and process the content of Notion pages, enabling you to build powerful and dynamic applications. Explore the capabilities of the `NotionPageContent` component and unlock new possibilities in your Langflow projects!