<?php
	define('ROOT_PATH', $_SERVER['DOCUMENT_ROOT'].'/');
    if(!empty($_FILES['images'])){
        // File upload configuration
        $targetDirImage = "/media/images/rolling_images/";
        $targetDirVideo = "/media/videos/rolling_videos/";
        $videoTypes = array('mp4');
        $allowTypes = array('jpg','png','jpeg','gif','mp4');
        $image_name = $_FILES['images']['name'];
        $tmp_name = $_FILES['images']['tmp_name'];
        $size = $_FILES['images']['size'];
        $type = $_FILES['images']['type'];
        $error = $_FILES['images']['error'];

        

        // File upload path
        $fileName = basename($_FILES["images"]["name"][0]);
        $targetFilePath = $targetDirImage . $fileName;
	
	// Check whether file type is valid
        $fileType = pathinfo($targetFilePath,PATHINFO_EXTENSION);

        
        if(in_array($fileType, $allowTypes)){ 
            // Store images on the server
			if(in_array($fileType, $videoTypes)){
				$targetFilePath = $targetDirVideo . $fileName;
					if(move_uploaded_file($_FILES['images']['tmp_name'][0],ROOT_PATH.$targetFilePath)){
						echo $targetFilePath;
					}
			}else{
				if(move_uploaded_file($_FILES['images']['tmp_name'][0],ROOT_PATH.$targetFilePath)){
					echo $targetFilePath;
				}
			}
        }
    }
?>


