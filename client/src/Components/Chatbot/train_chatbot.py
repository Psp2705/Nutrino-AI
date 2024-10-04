# import nltk
# nltk.download('punkt')
# nltk.download('wordnet')

# from nltk.stem import WordNetLemmatizer
# lemmatizer = WordNetLemmatizer()
# import json
# import pickle

# #import tensorflow as tf
# import numpy as np
# from keras.models import Sequential
# from keras.layers import Dense, Activation, Dropout
# #from keras.optimizers import legacy
# from keras.optimizers import SGD
# #from tensorflow.keras import Input
# #from tensorflow.keras.utils import to_categorical
# import random

# #initialize lists
# words =[]
# classes = []
# documents = []
# ignore_words=['?','!','@','$']

# #use json
# data_file = open('D:\NutriAI\src\Components\Chatbot\intents (1).json', encoding='utf-8').read()
# intents = json.loads(data_file)

# #populating the lists
# for intent in intents['intents']:
#     for pattern in intent['patterns']:

#         #take rach word and tokenize it
#         w = nltk.word_tokenize(pattern)
#         words.extend(w)

#         #adding documents
#         documents.append((w,intent['tag']))


#         #adding classes to our class list
#         if intent['tag'] not in classes:
#             classes.append(intent['tag'])

# words = [lemmatizer.lemmatize(w.lower()) for w in words if w not in ignore_words]
# words = sorted(list(set(words)))

# classes = sorted(list(set(classes)))

# print(len(documents), "Documents: ")
# #print(" /n")

# print(len(classes), "Classes:", classes)
# #print(" /n")

# print(len(words), "Unique Lemmatized words", words)
# #print(" /n")

# pickle.dump(words,open('words.pkl','wb'))
# pickle.dump(classes, open('classes.pkl','wb'))

# #initialise training data
# training = []
# output_empty = [0] * len(classes)

# for doc in documents:
#     #initializing the bag of words
#     bag = []
#     #list of tokenized words for pattern
#     pattern_words = doc[0]
#     pattern_words = [lemmatizer.lemmatize(word.lower()) for word in pattern_words]


#     for w in words:
#         bag.append(1) if w in pattern_words else bag.append(0)


#     output_row = list(output_empty)
#     output_row[classes.index(doc[1])] = 1

#     training.append([bag,output_row])
# # shuffle our features and turn into np.array
# random.shuffle(training)
# # Convert the list of bags-of-words and output labels to numpy arrays
# train_x = np.array([np.array(x[0]) for x in training], dtype=np.float32)  # Ensure uniform input size
# train_y = np.array([np.array(x[1]) for x in training], dtype=np.float32)  # Ensure uniform output size

# print("Training data created")

# # Check if all arrays have the correct shape
# print("train_x shape:", train_x.shape)
# print("train_y shape:", train_y.shape)

# # Create model - 3 layers. First layer 128 neurons, second layer 64 neurons and 3rd output layer contains number of neurons
# # equal to number of intents to predict output intent with softmax
# model = Sequential()
# model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))
# model.add(Dropout(0.5))
# model.add(Dense(64, activation='relu'))
# model.add(Dropout(0.5))
# model.add(Dense(len(train_y[0]), activation='softmax'))

# sgd = SGD(learning_rate= 0.01, decay=1e-6, momentum=0.9, nesterov=True)
# model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])

# # Check the shape of train_y before conversion (optional)
# #print("train_y shape before conversion:", train_y.shape)

# # Assuming train_y contains a list of integer class labels
# #num_classes = len(set(train_y))

# # One-hot encode the labels (if necessary)
# #if train_y.ndim == 1:  # Check if train_y is a 1D array
# #   train_y_encoded = to_categorical(train_y, num_classes)
# #else:
# #    train_y_encoded = train_y  # No need to encode if already 2D



# hist = model.fit(train_x, train_y, epochs=200, batch_size=5, verbose=1)

# model.save('chatbot_model.h5', hist)

# print('model created')