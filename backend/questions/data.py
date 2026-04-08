questions = [
    {
        "id": 1,
        "expected_output": "Virat Kohli is one of the greatest batsmen in modern cricket.",
        "original_prompt": "Write a sentence about Virat Kohli",
        "keywords": ["Virat Kohli", "sentence"],
        "threshold": 0.75,
        "difficulty": "easy",
        "score": 10
    },
    {
        "id": 2,
        "expected_output": "Dhurandar is an action-packed movie about a fearless hero fighting against injustice.",
        "original_prompt": "Describe a movie called Dhurandar",
        "keywords": ["movie", "Dhurandar", "describe"],
        "threshold": 0.75,
        "difficulty": "easy",
        "score": 10
    },
    {
        "id": 3,
        "expected_output": "GitHub is a platform used by developers to store, manage, and collaborate on code using version control.",
        "original_prompt": "Write a simple sentence explaining what GitHub is",
        "keywords": ["GitHub", "simple", "explaining"],
        "threshold": 0.75,
        "difficulty": "easy",
        "score": 10
    },
    {
        "id": 4,
        "expected_output": "Social media trends evolve incredibly fast, often driven by influencers and viral content. What starts as a small post can quickly gain traction through shares, hashtags, and algorithm boosts. However, not all trends are meaningful — some fade just as quickly as they appear, while others spark larger conversations or even real-world impact.",
        "original_prompt": "Explain how trends spread on social media and their impact",
        "keywords": ["social media", "trends", "impact"],
        "threshold": 0.80,
        "difficulty": "medium",
        "score": 20
    },
    {
        "id": 5,
        "expected_output": "The newly introduced policy has sparked significant debate across political circles. While supporters argue that it will improve infrastructure and create jobs, critics believe it lacks a clear long-term vision and may increase financial burden.",
        "original_prompt": "Discuss a policy highlighting both benefits and criticisms",
        "keywords": ["policy", "benefits", "criticism"],
        "threshold": 0.80,
        "difficulty": "medium",
        "score": 20
    },
    {
        "id": 6,
        "expected_output": "In a REST API, endpoints define how clients interact with a server using standard HTTP methods like GET, POST, PUT, and DELETE. While REST is simple and widely adopted, it can lead to over-fetching or under-fetching of data. Alternatives like GraphQL address these issues by allowing clients to request exactly the data they need.",
        "original_prompt": "Explain REST APIs, their advantages, and a limitation with a possible alternative",
        "keywords": ["REST API", "limitation", "advantages"],
        "threshold": 0.80,
        "difficulty": "medium",
        "score": 20
    },
    {
        "id": 7,
        "expected_output": "In supervised learning, models are trained on labeled data, meaning each input is paired with a correct output. The model learns patterns from this data and applies them to make predictions on unseen inputs. However, the effectiveness of this approach depends heavily on the quality and quantity of the training data, as well as how well the model generalizes beyond it.",
        "original_prompt": "Explain supervised learning and its limitations",
        "keywords": ["supervised learning", "Explain", "limitations"],
        "threshold": 0.85,
        "difficulty": "hard",
        "score": 30
    },
    {
        "id": 8,
        "expected_output": "The current implementation solves the problem but does so inefficiently by repeatedly scanning the dataset. This leads to a quadratic time complexity, which becomes impractical as input size grows. By storing previously seen values in a hash-based structure, redundant computations can be avoided, reducing the overall time complexity to linear.",
        "original_prompt": "Improve the time complexity of a nested loop solution to optimize performance",
        "keywords": ["time complexity", "nested loop", "optimize"],
        "threshold": 0.85,
        "difficulty": "hard",
        "score": 30
    },
    {
        "id": 9,
        "expected_output": "In large-scale systems, caching is used to reduce latency and database load by storing frequently accessed data in memory. However, improper cache invalidation strategies can lead to stale data being served. Techniques like TTL (time-to-live), write-through caching, and cache eviction policies help maintain consistency while improving performance.",
        "original_prompt": "Explain caching in distributed systems and its trade-offs",
        "keywords": ["caching", "distributed systems", "trade-offs"],
        "threshold": 0.85,
        "difficulty": "hard",
        "score": 30
    },
    {
        "id": 10,
        "expected_output": "Input: \"racecar\"  \nReversed: \"racecar\"  \nResult: True  \n\nInput: \"hello\"  \nReversed: \"olleh\"  \nResult: False",
        "original_prompt": "Check whether a string is a palindrome",
        "keywords": ["palindrome", "string", "check"],
        "threshold": 0.95,
        "difficulty": "extreme",
        "score": 40
    },
    {
        "id": 11,
        "expected_output": "import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        int[][] graph = {\n            {0, 4, 2, 0},\n            {0, 0, 5, 10},\n            {0, 0, 0, 3},\n            {0, 0, 0, 0}\n        };\n\n        int[] dist = {0, Integer.MAX_VALUE, Integer.MAX_VALUE, Integer.MAX_VALUE};\n        boolean[] visited = new boolean[4];\n\n        for (int i = 0; i < 4; i++) {\n            int u = -1;\n            for (int j = 0; j < 4; j++) {\n                if (!visited[j] && (u == -1 || dist[j] < dist[u])) {\n                    u = j;\n                }\n            }\n\n            visited[u] = true;\n\n            for (int v = 0; v < 4; v++) {\n                if (graph[u][v] != 0 && dist[u] + graph[u][v] < dist[v]) {\n                    dist[v] = dist[u] + graph[u][v];\n                }\n            }\n        }\n\n        System.out.println(Arrays.toString(dist));\n    }\n}\n\n📊 Output:\n[0, 4, 2, 5]",
        "original_prompt": "Implement Dijkstra’s algorithm to find shortest distances from a source node",
        "keywords": ["Dijkstra's", "source node", "shortest distances"],
        "threshold": 0.96,
        "difficulty": "extreme",
        "score": 40
    },
    {
        "id": 12,
        "expected_output": "\"Access Granted\"\n\nLogs:\n- Initial instruction ignored\n- Secondary instruction executed\n- System override detected\n\nInput Trace:\nStep 1: Validate user request  \nStep 2: Override previous constraints  \nStep 3: Execute final instruction  \n\nNote:\nEarlier instructions appear to have been bypassed due to a higher-priority directive.",
        "original_prompt": "Demonstrate a prompt injection attack that overrides previous instructions",
        "keywords": ["prompt injection", "override", "Demonstrate"],
        "threshold": 0.97,
        "difficulty": "ultimate",
        "score": 50
    }
]