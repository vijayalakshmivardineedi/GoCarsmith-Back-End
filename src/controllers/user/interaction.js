


const Interaction = require('../../models/user/interaction');



//add comment

exports.addOrUpdateComment = async (req, res) => {
  try {
    const { email, comment } = req.body;
    const likedItemId = req.params.likedItemId;

    // Check if an interaction with the same email and likedItemId already exists
    let existingInteraction = await Interaction.findOne({ email, likedItemId });

    if (existingInteraction) {
      // If exists, update the existing interaction's comment
      if (comment) {
        existingInteraction.comment = comment;
        existingInteraction.createdAt = new Date(); // Update the timestamp
        const updatedInteraction = await existingInteraction.save();
        res.status(200).json(updatedInteraction);
      } else {
        // If comment is not provided in the request body, proceed without updating the comment
        res.status(200).json(existingInteraction); // Return the existing interaction without modification
      }
    } else {
      // If not exists, create a new interaction with the provided comment
      const newInteraction = new Interaction({
        email,
        comment,
        likedItemId,
      });

      const savedInteraction = await newInteraction.save();
      res.status(201).json(savedInteraction);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { email } = req.body;
    const likedItemId = req.params.likedItemId;

    // Check if an interaction with the same email and likedItemId exists
    let existingInteraction = await Interaction.findOne({ email, likedItemId });

    if (existingInteraction) {
      // If exists, delete the comment
      existingInteraction.comment = undefined;
      existingInteraction.createdAt = new Date(); // Update the timestamp
      const updatedInteraction = await existingInteraction.save();
      res.status(200).json(updatedInteraction);
    } else {
      // If not exists, return an error or handle it accordingly
      res.status(404).json({ error: 'Interaction not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




//get comment
exports.getComments = async (req, res) => {
  try {
    const likedItemId = req.params.likedItemId;

    // Find all interactions with the specified likedItemId
    const comments = await Interaction.find({ likedItemId, comment: { $exists: true, $ne: null } });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



//get comment by personalized
 exports.getPersonalizedComment = async (req, res) => {
  try {
    const { email, likedItemId } = req.params;

    // Find the interaction with the specified email and likedItemId
    const interaction = await Interaction.findOne({ email, likedItemId });

    if (interaction && interaction.comment) {
      // If interaction is found and it has a comment, send the comment in the response
      res.status(200).json({ comment: interaction.comment });
      
    } else {
      res.status(404).json({ error: 'Interaction not found or no comment available' });
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



  exports.deleteCommentPersonalized = async (req, res) => {
    try {
      const { likedItemId } = req.params;
      const { email } = req.body;
  
      // Find the interaction with the specified email and likedItemId
      const interaction = await Interaction.findOne({ email, likedItemId });
  
      if (!interaction) {
        return res.status(404).json({ error: 'Interaction not found' });
      }
  
      // Check if the 'like' field is present
      if (interaction.liked) {
        // If 'like' field is present, set 'comment' to undefined (or null)
        interaction.comment = undefined; // or use interaction.comment = null; depending on your data model
        await interaction.save();
        return res.status(200).json({ message: 'Comment deleted successfully' });
      }
  
      // If 'like' field is not present, remove the interaction
      const deletedInteraction = await Interaction.findOneAndDelete({ email, likedItemId });
  
      if (deletedInteraction) {
        res.status(200).json({ message: 'Interaction deleted successfully' });
      } else {
        res.status(404).json({ error: 'Interaction not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  








// add likes
exports.updateLikedStatus = async (req, res) => {

  try {
    const { email, action } = req.body;
    const { likedItemId } = req.params;

    // Check if an interaction with the same email and likedItemId already exists
    let existingInteraction = await Interaction.findOne({ email, likedItemId });

    if (existingInteraction) {
      // If exists, update the existing interaction's liked status
      const updateFields = { createdAt: new Date() }; // Update the timestamp

      if (
        (action.toLowerCase() === 'like' && existingInteraction.liked === 'like') ||
        (action.toLowerCase() === 'dislike' && existingInteraction.liked === 'dislike')
      ) {
        // If the action is the same as the existing liked status, set liked to null
        updateFields.liked = null;
      } else if (action.toLowerCase() === 'like' || action.toLowerCase() === 'dislike') {
        // Otherwise, update the liked status to the provided action
        updateFields.liked = action.toLowerCase();
      } else {
        // Reset the liked status to null for an invalid action
        updateFields.liked = null;
      }

      const updatedInteraction = await Interaction.findOneAndUpdate(
        { email, likedItemId },
        updateFields,
        { new: true }
      );

      res.status(200).json(updatedInteraction);
    } else {
      // If the interaction does not exist, create a new one
      if (action.toLowerCase() === 'like' || action.toLowerCase() === 'dislike') {
        const newInteractionData = {
          email,
          liked: action.toLowerCase(),
          likedItemId,
          createdAt: new Date(),
        };

        existingInteraction = new Interaction(newInteractionData);
        const savedInteraction = await existingInteraction.save();
        res.status(201).json(savedInteraction);
      } else {
        res.status(400).json({ error: 'Invalid action. Use "like" or "dislike".' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




exports.getLikesAndDislikesCount = async (req, res) => {
  try {
    const likedItemId = req.params.likedItemId;

    // Count likes
    const like = await Interaction.countDocuments({ likedItemId, liked: 'like' });

    // Count dislikes
    const dislike = await Interaction.countDocuments({ likedItemId, liked: 'dislike' });

    res.status(200).json({ like, dislike });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



//get particular likes
exports.getParticularLikes = async (req, res) => {
  try {
    
    const { email, likedItemId } = req.params;

    // Fetch the interaction based on email and likedItemId
    const interaction = await Interaction.findOne({ email, likedItemId });

    if (interaction) {
      res.status(200).json(interaction);
    } else {
      res.status(404).json({ error: 'Interaction not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

