
## API Reference

#### For Logged-In User

```http
  POST /quizStart
```
```http
  {
  "step": 3,
  "selectedClass": "Class 6",
  "subjectName": "Mathematics",
  "topicName": "Algebra",
  "difficulty": "Medium",
  "title": "Algebra Quiz",
  "userId": "6ee0f043-e6f1-411d-83b6-d1dbd7630309",
  "token": "valid.jwt.token.here"
}

```
#### Expected Output
```http
  {
    "success": true,
    "sessionId": "2825db82-543a-45a2-962e-fbed73be32df",
    "questions": [
        {
            "qno": 1,
            "id": 3338,
            "question": "How many periods are there in the Indian numeral system?",
            "optiona": "2",
            "optionb": "3",
            "optionc": "4",
            "optiond": "5"
        },....

```

```http
  POST /quizSubmit
```
```http
      {
    "sessionId": "uuid",
    "timeTaken": 300,
    "userId": "uuid",
    "answers": [
        { "questionId": 3338, "userAnswer": "C" },
        { "questionId": 3341, "userAnswer": "A" },
        { "questionId": 3342, "userAnswer": "B" },
        { "questionId": 3344, "userAnswer": "B" },
        { "questionId": 3345, "userAnswer": "B" },
        { "questionId": 3346, "userAnswer": "B" },
        { "questionId": 3349, "userAnswer": "A" },
        { "questionId": 3350, "userAnswer": "A" },
        { "questionId": 3353, "userAnswer": "C" },
        { "questionId": 3354, "userAnswer": "B" },
        { "questionId": 3356, "userAnswer": "B" },
        { "questionId": 3358, "userAnswer": "B" },
        { "questionId": 3361, "userAnswer": "B" },
        { "questionId": 3362, "userAnswer": "A" },
        { "questionId": 3363, "userAnswer": "A" },
        { "questionId": 3364, "userAnswer": "B" },
        { "questionId": 3365, "userAnswer": "B" },
        { "questionId": 3368, "userAnswer": "B" },
        { "questionId": 3371, "userAnswer": "B"},
        { "questionId": 3374, "userAnswer": "B" }
    ]
    }
```

#### Expected Output
```http
{
    "success": true,
    "sessionId": "2825db82-543a-45a2-962e-fbed73be32df",
    "correctCount": 13,
    "incorrectCount": 7,
    "totalQuestions": 20,
    "timeTaken": 300
}

```


```http
  POST /quizResult
```
```http
{   
    "userId": "6ee0f043-e6f1-411d-83b6-d1dbd7630309",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlZTBmMDQzLWU2ZjEtNDExZC04M2I2LWQxZGJkNzYzMDMwOSIsImVtYWlsIjoiZGVlcGFrc2luZ2hhbDAzMjBAZ21haWwuY29tIiwiaWF0IjoxNzM4NTcyNDk3LCJleHAiOjE3Mzg2NTg4OTd9.kxC7LjZtnFuK7DV20H1NVOZ07x7123P4BkIfJtAF40c"
}   
```
#### Expected Output
```http
      {
    "success": true,
    "sessionId": "3bff5afa-862a-4b15-87f2-0d0dd3830f82",
    "createdAt": "2025-02-03T11:34:16.510Z",
    "totalQuestions": 20,
    "questions": [
        {
            "questionId": 3338,
            "qno": 1,
            "question": "How many periods are there in the Indian numeral system?",
            "options": {
                "A": "2",
                "B": "3",
                "C": "4",
                "D": "5"
            },....

```

## API Reference

#### For Logged-Out User

```http
  POST /quizStart
```
```http
  {
  "step": 3,
  "selectedClass": "Class 6",
  "subjectName": "Mathematics",
  "topicName": "Algebra",
  "difficulty": "Medium",
  "title": "Algebra Quiz",
  "userId": "",
  "token": "valid.jwt.token.here"
}

```
#### Expected Output
```http
  {
    "success": true,
    "sessionId": "2825db82-543a-45a2-962e-fbed73be32df",
    "questions": [
        {
            "qno": 1,
            "id": 3338,
            "question": "How many periods are there in the Indian numeral system?",
            "optiona": "2",
            "optionb": "3",
            "optionc": "4",
            "optiond": "5"
        },....

```

```http
  POST /quizSubmit
```
```http
      {
    "sessionId": "uuid",
    "timeTaken": 300,
    "userId": "",   
    "answers": [
        { "questionId": 3338, "userAnswer": "C" },
        { "questionId": 3341, "userAnswer": "A" },
        { "questionId": 3342, "userAnswer": "B" },
        { "questionId": 3344, "userAnswer": "B" },
        { "questionId": 3345, "userAnswer": "B" },
        { "questionId": 3346, "userAnswer": "B" },
        { "questionId": 3349, "userAnswer": "A" },
        { "questionId": 3350, "userAnswer": "A" },
        { "questionId": 3353, "userAnswer": "C" },
        { "questionId": 3354, "userAnswer": "B" },
        { "questionId": 3356, "userAnswer": "B" },
        { "questionId": 3358, "userAnswer": "B" },
        { "questionId": 3361, "userAnswer": "B" },
        { "questionId": 3362, "userAnswer": "A" },
        { "questionId": 3363, "userAnswer": "A" },
        { "questionId": 3364, "userAnswer": "B" },
        { "questionId": 3365, "userAnswer": "B" },
        { "questionId": 3368, "userAnswer": "B" },
        { "questionId": 3371, "userAnswer": "B"},
        { "questionId": 3374, "userAnswer": "B" }
    ]
    }

```

#### Expected Output
```http
{
    "success": true,
    "sessionId": "2825db82-543a-45a2-962e-fbed73be32df",
    "correctCount": 13,
    "incorrectCount": 7,
    "totalQuestions": 20,
    "timeTaken": 300
}

```


```http
  POST /quizResult
```
```http
{   
    "sessionId": "2825db82-543a-45a2-962e-fbed73be32df",
    
    }   
```
#### Expected Output
```http{
    "success": true,
    "sessionId": "uuid",
    "createdAt": "2025-02-03T11:34:16.510Z",
    "totalQuestions": 20,
    "questions": [
        {
            "questionId": 3338,
            "qno": 1,
            "question": "How many periods are there in the Indian numeral system?",
            "options": {
                "A": "2",
                "B": "3",
                "C": "4",
                "D": "5"
            },....

```