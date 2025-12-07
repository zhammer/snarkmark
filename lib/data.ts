export interface Article {
  id: string;
  title: string;
  authors: string[];
  publication_year: number;
  journal?: string;
  doi?: string;
  abstract?: string;
  tags?: string[];
}

export interface Review {
  id: string;
  article_id: string;
  rating: number;
  content: string;
  liked: boolean;
  created_by: string;
  created_date: string;
}

export interface User {
  email: string;
}

// Mock data
export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Attention Is All You Need",
    authors: ["Vaswani A.", "Shazeer N.", "Parmar N.", "Uszkoreit J."],
    publication_year: 2017,
    journal: "NeurIPS 2017",
    doi: "https://arxiv.org/abs/1706.03762",
    abstract:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
    tags: ["AI", "NLP", "Transformer", "Deep Learning"],
  },
  {
    id: "2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: ["Devlin J.", "Chang M.W.", "Lee K.", "Toutanova K."],
    publication_year: 2019,
    journal: "NAACL 2019",
    doi: "https://arxiv.org/abs/1810.04805",
    abstract:
      "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabeled text by jointly conditioning on both left and right context in all layers.",
    tags: ["AI", "NLP", "BERT", "Language Models"],
  },
  {
    id: "3",
    title: "GPT-4 Technical Report",
    authors: ["OpenAI"],
    publication_year: 2023,
    journal: "arXiv",
    doi: "https://arxiv.org/abs/2303.08774",
    abstract:
      "We report the development of GPT-4, a large-scale, multimodal model which can accept image and text inputs and produce text outputs. While less capable than humans in many real-world scenarios, GPT-4 exhibits human-level performance on various professional and academic benchmarks.",
    tags: ["AI", "LLM", "Multimodal", "GPT"],
  },
  {
    id: "4",
    title: "Deep Residual Learning for Image Recognition",
    authors: ["He K.", "Zhang X.", "Ren S.", "Sun J."],
    publication_year: 2016,
    journal: "CVPR 2016",
    doi: "https://arxiv.org/abs/1512.03385",
    abstract:
      "Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions.",
    tags: ["AI", "Computer Vision", "ResNet", "Deep Learning"],
  },
  {
    id: "5",
    title: "ImageNet Classification with Deep Convolutional Neural Networks",
    authors: ["Krizhevsky A.", "Sutskever I.", "Hinton G.E."],
    publication_year: 2012,
    journal: "NeurIPS 2012",
    doi: "https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks",
    abstract:
      "We trained a large, deep convolutional neural network to classify the 1.2 million high-resolution images in the ImageNet LSVRC-2010 contest into the 1000 different classes. On the test data, we achieved top-1 and top-5 error rates of 37.5% and 17.0% which is considerably better than the previous state-of-the-art.",
    tags: ["AI", "Computer Vision", "CNN", "ImageNet"],
  },
  {
    id: "6",
    title: "Generative Adversarial Networks",
    authors: ["Goodfellow I.", "Pouget-Abadie J.", "Mirza M."],
    publication_year: 2014,
    journal: "NeurIPS 2014",
    doi: "https://arxiv.org/abs/1406.2661",
    abstract:
      "We propose a new framework for estimating generative models via an adversarial process, in which we simultaneously train two models: a generative model G that captures the data distribution, and a discriminative model D that estimates the probability that a sample came from the training data rather than G.",
    tags: ["AI", "Generative Models", "GAN"],
  },
];

export const mockReviews: Review[] = [
  {
    id: "r1",
    article_id: "1",
    rating: 5,
    content:
      "A landmark paper that changed the entire field. The self-attention mechanism is elegant and powerful. This is required reading for anyone in NLP.",
    liked: true,
    created_by: "alice@example.com",
    created_date: "2024-11-15T10:30:00Z",
  },
  {
    id: "r2",
    article_id: "1",
    rating: 4.5,
    content:
      "Revolutionary work. The positional encoding is clever, though I wish they had explored more alternatives.",
    liked: true,
    created_by: "bob@example.com",
    created_date: "2024-11-10T14:20:00Z",
  },
  {
    id: "r3",
    article_id: "2",
    rating: 5,
    content:
      "BERT changed everything about how we approach NLP tasks. The masked language modeling objective is brilliant.",
    liked: true,
    created_by: "charlie@example.com",
    created_date: "2024-10-28T09:15:00Z",
  },
  {
    id: "r4",
    article_id: "3",
    rating: 4,
    content:
      "Impressive capabilities but the paper is light on technical details. Still, an important milestone in AI development.",
    liked: false,
    created_by: "alice@example.com",
    created_date: "2024-11-01T16:45:00Z",
  },
  {
    id: "r5",
    article_id: "4",
    rating: 5,
    content:
      "The skip connections are so simple yet so effective. This paper made training very deep networks practical.",
    liked: true,
    created_by: "bob@example.com",
    created_date: "2024-09-20T11:00:00Z",
  },
];

export const mockUser: User = {
  email: "demo@snarkmark.com",
};

// Stub API functions that just log
export const api = {
  articles: {
    list: (options?: { limit?: number; sort?: Record<string, number> }) => {
      console.log("[API] Fetching articles", options);
      return { data: mockArticles };
    },
    get: (id: string) => {
      console.log("[API] Fetching article", id);
      return mockArticles.find((a) => a.id === id);
    },
    create: (data: Omit<Article, "id">) => {
      console.log("[API] Creating article", data);
      return { ...data, id: String(mockArticles.length + 1) };
    },
  },
  reviews: {
    list: (options?: {
      query?: Record<string, string>;
      sort?: Record<string, number>;
    }) => {
      console.log("[API] Fetching reviews", options);
      if (options?.query?.article_id) {
        return {
          data: mockReviews.filter(
            (r) => r.article_id === options.query?.article_id
          ),
        };
      }
      return { data: mockReviews };
    },
    create: (data: Omit<Review, "id" | "created_by" | "created_date">) => {
      console.log("[API] Creating review", data);
      return {
        ...data,
        id: String(mockReviews.length + 1),
        created_by: mockUser.email,
        created_date: new Date().toISOString(),
      };
    },
    filter: (query: Record<string, string>) => {
      console.log("[API] Filtering reviews", query);
      return {
        data: mockReviews.filter((r) => r.created_by === query.created_by),
      };
    },
  },
  auth: {
    me: () => {
      console.log("[API] Fetching current user");
      return mockUser;
    },
    redirectToLogin: () => {
      console.log("[API] Redirecting to login");
    },
  },
};
