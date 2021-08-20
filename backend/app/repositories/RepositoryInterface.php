<?php

namespace app\repositories;

interface RepositoryInterface
{
    public function getAll();
    public function create($id);
    public function update($id);
    public function delete($id);

}