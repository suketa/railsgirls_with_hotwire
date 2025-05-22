# frozen_string_literal: true

# CommentsController
# コメントの登録、削除を行う
class CommentsController < ApplicationController
  before_action :set_idea, only: %i[create edit update destroy]
  before_action :set_comment, only: %i[edit update destroy]

  def create
    @comment = @idea.comments.new(comment_params)
    if @comment.save
      # redirect_to idea_path(@idea), notice: 'Comment was successfully created.'
      render :create, status: :created
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    @comment.assign_attributes(comment_params)
    if @comment.save
      render :show
    else
      render :edit
    end
  end

  def destroy
    @comment.destroy!

    render :destroy, status: :ok
  end

  private

  def set_idea
    @idea = Idea.find(params[:idea_id])
  end

  def set_comment
    @comment = @idea.comments.find(params[:id])
  end

  def comment_params
    params.require(:comment).permit(:user_name, :body)
  end
end
